#define FAST
#define DEBUG
#undef BROWSER

function randomInt(from, to) {
#ifdef FAST
	// Ugh... it's an example.. :S
	return Math.random() * to + from;
#else
	from -= 0.449;
	to += 0.449;

#ifdef DEBUG
#ifndef BROWSER
    project.log('hello world');
#else
    console.log('hello world');
#endif
#endif
	return Math.round(from + (to - from) * Math.random());
#endif
}