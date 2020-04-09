const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

function uuidV4() {
	const chars = CHARS;
	const uuid = new Array(36);
	let rnd=0;
	let r = null;

	for (let i: number = 0; i < 36; i++) {
		if (i === 8 || i === 13 || i === 18 || i === 23) {
			uuid[i] = '-';
		} else if (i === 14) {
			uuid[i] = '4';
		} else {
			if (rnd <= 0x02) {
				rnd = 0x2000000 + (Math.random()*0x1000000)|0;
			}

			r = rnd & 0xf;
			rnd = rnd >> 4;
			uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
		}
	}

	return uuid.join('');
}

export { uuidV4 };