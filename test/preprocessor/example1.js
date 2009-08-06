#define FAST

function randomInt(from, to) {
#ifdef FAST
	// Ugh... it's an example.. :S
	return Math.random() * to + from;
#else
	from -= 0.449;
	to += 0.449;

	return Math.round(from + (to - from) * Math.random());
#endif
}