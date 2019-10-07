enum Level {
	TRACE,
	DEBUG,
	INFO,
	ERROR,
	FATAL,
	DISABLE,
}

namespace Level {
	export function valueOf(lvl: string): Level {
		return Level[lvl];
	}

	export function stringValueOf(lvl: Level): string {
		return Level[lvl];
	}

	export function getKeys(): Array<string> {
		let keys: Array<string> = [];
		for (let [key] of Object.entries(Level)) {
			let tstr: any = key;
			if (!isNaN(tstr)) {
				keys[key] = Level.stringValueOf(tstr);
			}
		}
		return keys;
	};

	export function values(): Array<Level> {
		return getKeys().map(key => {
			return Level[key];
		});
	}

	export function size(): number {
		return getKeys().length;
	}
}

export default Level;
