/* Copyright (c) 2008 Khoo Yit Phang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * JavaScript arrows, as described in the paper.
 *
 * Arrows are written according to the following convention:
 *    1. Arrow types are named FooA.
 *
 *    2. Arrows are identified by their identity function FooA.prototype.FooA().
 *
 *    3. Functions are given an (auto)-lifting function Function.prototype.FooA() for each FooA; since all
 *       (single-argument) functions can be lifted into arrows.
 *
 *    4. Arrow constructors are divided into two types:
 *           i.  arrow prototype constructors constructs arrows around their specific function type (usually not used
 *               directly);
 *           ii. arrow constructors which already embed a specific (parameterized) function (typically built with arrow
 *               prototype constructors).
 *       (i.e., arrow prototype constructors are like abstract classes, arrow constructors like concrete classes).
 *
 *    5. Functions lifted via Function.prototype.FooA() are assumed to not know anything about arrows.
 *       Arrows can be constructed from functions via arrow (prototype) constructors. E.g.:
 *             var fA = f.FooA();    // f is just a single-argument function that knows nothing about FooA
 *             var gA = new FooA(g); // g has to conform to FooA's internal function representation
 *
 *    6. Arrow constructors begin with the idiom:
 *           if (!(this instanceof FooA))
 *               return new FooA(eventname);
 *       This allows arrows to be constructed without the new operator.
 *
 *    7. Every binary arrow combinator f.bar(g) begins with the idiom:
 *           g = g.FooA();
 *       This serves two purposes: it performs a dynamic-check on the arrow type (i.e., throws an error if g is
 *       incompatible with f); and it auto-lifts functions to arrows.
 */



/*
 * Arrows for standard, single-argument functions: a -> b
 *
 * We simply attach the arrow interface to Function.prototype, thus implicitly making all functions arrows.
 *
 * This will not work correctly with > 1 argument functions.
 */

Function.prototype.A = function() { /* arr */
    return this;
}
Function.prototype.next = function(g) { /* >>> */
    var f = this; g = g.A(); /* ensure g is a function */
    return function(x) { return g(f(x)); }
}



/*
 * CpsA: Arrows for continuation-passing style (CPS) functions: (x, k) -> ()
 *
 * We create these arrows with the CpsA constructor, which wraps a CPS function.
 */

function CpsA(cps) {
    this.cps = cps; /* cps :: (x, k) -> () */
}
CpsA.prototype.CpsA = function() {
    return this;
}
CpsA.prototype.next = function(g) {
    var f = this; g = g.CpsA();
    /* CPS function composition */
    return new CpsA(function(x, k) {
        f.cps(x, function(y) {
            g.cps(y, k);
        });
    });
}
CpsA.prototype.run = function(x) {
    this.cps(x, function() {});
}
Function.prototype.CpsA = function() {
    var f = this;
    /* wrap f in CPS function */
    return new CpsA(function(x, k) {
        k(f(x));
    });
}



/*
 * SimpleEventA: Arrows for simple event handling on HTML elements, constructed on CpsA.
 *
 * When run, SimpleEventA installs an event handler on the input, and when the event fires, uninstalls the event
 * handler, and passes the event object to the next arrow.
 *
 * It is not possible to cancel SimpleEventA after it is run.
 */

function SimpleEventA(eventname) {
    if (!(this instanceof SimpleEventA))
        return new SimpleEventA(eventname);
    this.eventname = eventname;
}
SimpleEventA.prototype = new CpsA(function(target, k) {
    var f = this;
    function handler(event) {
        target.removeEventListener(
            f.eventname, handler, false);
        k(event);
    }
    target.addEventListener(f.eventname, handler, false);
});



/*
 * AsyncA: Arrows containing CPS asynchronous functions, with support for progress and cancellation: (x, p, k) -> ()
 *
 * Provides an additional Progress arrow channel p; AsyncA arrows should register themselves with the Progress arrow
 * (with addCanceller()) prior to entering an asynchronous function, and de-register themselves when continuing the
 * asynchronous callback is invoked (with advance()).
 *
 * AsyncA arrows are run using run(), giving an input parameter, and an optional pre-constructed progress arrow.
 */

function AsyncA(cps) {
    this.cps = cps;
}
AsyncA.prototype.AsyncA = function() {
    return this;
}
AsyncA.prototype.next = function(g) {
    var f = this; g = g.AsyncA();
    return new AsyncA(function(x, p, k) {
        f.cps(x, p, function(y, q) {
            g.cps(y, q, k);
        });
    });
}
AsyncA.prototype.run = function(x, p) {
    p = p || new ProgressA();
    this.cps(x, p, function() {});
    return p;
}
Function.prototype.AsyncA = function() {
    var f = this;
    return new AsyncA(function(x, p, k) {
        k(f(x), p);
    });
}



/*
 * ProgressA: Arrows for tracking progress of an AsyncA arrow (i.e. progress event handler).
 *
 * Two operations are supported: ProgressA arrows can be composed to handle progress events (arrows calling advance())
 * of their corresponding AsyncA arrows instance; ProgressA arrows can also be used to cancel the entire operation
 * their AsyncA arrows.
 */

function ProgressA() {
    if (!(this instanceof ProgressA))
        return new ProgressA();
    this.cancellers = []; /* empty arrays */
    this.observers = [];
}
ProgressA.prototype = new AsyncA(function(x, p, k) {
    this.observers.push(function(y) { k(y, p); });
});
ProgressA.prototype.addCanceller = function(canceller) {
    /* add canceller function */
    this.cancellers.push(canceller);
}
ProgressA.prototype.advance = function(canceller) {
    /* remove canceller function */
    var index = this.cancellers.indexOf(canceller);
    if (index >= 0) this.cancellers.splice(index, 1);
    /* signal observers */
    while (this.observers.length > 0)
        this.observers.pop()();
}
ProgressA.prototype.cancel = function() {
    while (this.cancellers.length > 0)
        this.cancellers.pop()();
}



/*
 * EventA: Arrows for event handling on HTML elements, constructed on AsyncA, with support for progress and
 * cancellation.
 *
 * When run, EventA installs an event handler on the input and waits for the event. When it fires, it then uninstalls
 * the event handler and passes the event object to the next arrow.
 */

function EventA(eventname) {
    if (!(this instanceof EventA))
        return new EventA(eventname);
    this.eventname = eventname;
}
EventA.prototype = new AsyncA(function(target, p, k) {
    var f = this;
    function cancel() {
        target.removeEventListener(f.eventname,
            handler, false);
    }
    function handler(event) {
        p.advance(cancel);
        cancel();
        k(event, p);
    }
    p.addCanceller(cancel);
    target.addEventListener(f.eventname, handler, false);
});



/*
 * AsyncA.prototype.repeat(): looping operator.
 *
 * Puts an arrow into a loop, and inserts a delay on each iteration to yield to the UI. The arrow should return either
 * Repeat(x) or Done(x), to repeat or exit the loop respectively.
 *
 * Two caveats: most browsers are limited to 100Hz (for setTimeout()); the delay may also be undesirable when repeat is
 * used on EventA or other AsyncA arrows, as it results in a momentarily loss in event tracking (e.g., between
 * mousemove-drag events).
 */

AsyncA.prototype.repeat = function() {
    var f = this;
    return new AsyncA(function rep(x, p, k) {
        f.cps(x, p, function(y, q) {
            if (y.Repeat) {
                function cancel() { clearTimeout(tid); }
                q.addCanceller(cancel);
                var tid = setTimeout(function() {
                    q.advance(cancel);
                    rep(y.value, q, k);
                }, 0);
            } else if (y.Done)
                k(y.value, q);
            else
                throw new TypeError("Repeat or Done?");
        });
    });
}

function Repeat(x) { return { Repeat:true, value:x }; }
function Done(x)   { return { Done:true,   value:x }; }

Function.prototype.repeat = function() {
    return this.AsyncA().repeat();
}



/*
 * AsyncA.prototype.or(): either-or combinator.
 *
 * Given two AsyncA arrows, create a composite arrow that allow only one of the components, whichever is the first to
 * trigger, to execute. The other arrow will be cancelled.
 *
 * Caveat: Both arrows are assumed to be true asynchronous arrows, i.e., both internally calls a function with an
 * asynchronous callbacks. This implementation does not work correctly if either arrow is actually synchronous.
 */

AsyncA.prototype.or = function(g) {
    var f = this; g = g.AsyncA();
    return new AsyncA(function(x, p, k) {
        /* one progress for each branch */
        var p1 = new ProgressA();
        var p2 = new ProgressA();
        /* if one advances, cancel the other */
        p1.next(function() { p2.cancel();
                             p2 = null; }).run();
        p2.next(function() { p1.cancel();
                             p1 = null; }).run();
        function cancel() {
            if (p1) p1.cancel();
            if (p2) p2.cancel();
        }
        /* prepare callback */
        function join(y, q) {
            p.advance(cancel);
            k(y, q);
        }
        /* and run both */
        p.addCanceller(cancel);
        f.cps(x, p1, join);
        g.cps(x, p2, join);
    });
}



/*
 * ConstA: Arrow that returns a constant (ignoring its input).
 */

function ConstA(x) {
    return (function() { return x; }).AsyncA();
}
