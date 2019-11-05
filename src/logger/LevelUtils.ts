import Level from "./Level";

class LevelUtils {

	public static valueOf(lvl: string): Level {
		return Level[lvl];
	}

	public static stringValueOf(lvl: Level): string {
		return Level[lvl];
	}

	public static getKeys(): String[] {
		const keys: String[] = [];
		for (const k of Object.keys(Level)) {
			if (this.rx.test(k)) {
				keys[k] = this.stringValueOf(Number.parseInt(k, 10));
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

	private static readonly rx = /\d+/;
}

export default LevelUtils;
