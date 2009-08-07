#define FAST

//#else

function randomInt(from, to) {
#ifdef FAST
	// Ugh... it's an example.. :S
	return Math.random() * to + from;
#else
	from -= 0.449;
	to += 0.449;

#ifdef DEBUG
    project.log('hello world');
#else
    console.log('hello world');
#endif
	return Math.round(from + (to - from) * Math.random());
#endif
}