import Level from "@/logger/Level";

const DIGITS: RegExp = /\d+/;

class LevelUtils {

	public static valueOf(level: string): Level {
		return Level[level];
	}

	public static stringValueOf(level: Level): string {
		return Level[level];
	}

	public static getKeys(): String[] {
		const keys: String[] = [];

		for (const key of Object.keys(Level)) {
			if (DIGITS.test(key)) {
				keys[key] = this.stringValueOf(Number.parseInt(key, 10));
			}
		}

		return keys;
	}

	public static values(): Level[] {
		return this.getKeys().map((key: string) => {
			return Level[key];
		});
	}

	public static size(): number {
		return this.getKeys().length;
	}

}

export default LevelUtils;
