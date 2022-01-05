import { asIdentity, asBoolean, asString, asNumber } from "util/AsFunctions";

test("asIdentity", () => {
	const name: string = "Cydran";
	expect(asIdentity(name)).toEqual(name);
});

test("asBoolean", () => {
	expect(asBoolean(false)).toEqual(false);
	expect(asBoolean("false".toUpperCase())).toEqual(true);
	expect(asBoolean("XYZ".toLocaleLowerCase())).toEqual(true);
	expect(asBoolean(0)).toEqual(false);
	expect(asBoolean(1)).toEqual(true);
	expect(asBoolean(-0)).toEqual(false);
	expect(asBoolean(NaN)).toEqual(false);
	expect(asBoolean(undefined)).toEqual(false);
	expect(asBoolean("")).toEqual(false);
	expect(asBoolean(new Object())).toEqual(true);
});

test("asString", () => {
	expect(asString(false)).toEqual("false");
	expect(asString("Cydran")).toEqual("Cydran");
	const wkObj: Object = {};
	wkObj['a'] = "A";
	const result: string = JSON.stringify(wkObj);
	expect(asString(wkObj)).toEqual(result);
	expect(asString(123)).toEqual("123");
	expect(asString(null)).toEqual(null);
	expect(asString(undefined)).toEqual(null);
});

test("asNumber", () => {
	expect(asNumber(false)).toEqual(0);
	expect(asNumber("Cydran")).toEqual(NaN);
	expect(asNumber("123")).toEqual(123);
	expect(asNumber(123.23)).toEqual(123.23);
	expect(asNumber(undefined)).toEqual(null);
	expect(asNumber(true)).toEqual(1);
	expect(asNumber(asBoolean("false".toUpperCase()))).toEqual(1);
});
