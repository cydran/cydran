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
		for (const [key] of Object.entries(Level)) {
			const tstr: any = key;
			if (!isNaN(tstr)) {
				keys[key] = this.stringValueOf(tstr);
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
