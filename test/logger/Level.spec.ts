import LevelUtils from "@/logger/LevelUtils";

const enumStates: String[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"];

test(".getKeys(): Array<string>", () => {
	const objKeys: String[] = LevelUtils.getKeys();
	expect(enumStates).toEqual(objKeys);
});

test(".size(): number", () => {
	expect(enumStates.length).toEqual(LevelUtils.size());
});

test(".values(): Array<Level>", () => {
	expect(LevelUtils.values().length).toEqual(enumStates.length);
});

test(".stringValueOf(l:Level): string", () => {
	LevelUtils.values().forEach((v) => {
		expect(enumStates).toContain(LevelUtils.stringValueOf(v));
	});
});

test(".valueOf(lvl:string): Level", () => {
	expect(LevelUtils.valueOf("bubba")).toBeUndefined();
});
