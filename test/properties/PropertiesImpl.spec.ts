import PropertiesImpl from "properties/PropertiesImpl";
import SimpleMap from "interface/SimpleMap";
import { MutableProperties, PropFlagVals } from 'properties/Property';

const p1: SimpleMap<any> = {
	"-|a.b.a": "a1",
	"a.b.b": "b1",
	"a.b.c": "c1",
	"-|xyz.abc.one": "one1",
	"xyz.abc.two": "two2",
	"-|xyz.cba.one": "1one",
	"xyz.cba.two": "2two",
	"xyz.wild.one": "wild1",
	"zyx": {a: 1, b: 2, c: 3}
};

const p2: SimpleMap<any> = {
	"-|a.b.b": "b2",
	"a.b.c": "c2",
	"a.b.d": "d2",
	"xyz.abc.three": "three3",
	"xyz.abc.four": "four4",
	"xyz.wild.two": "wild2"
};

const p3: SimpleMap<any> = {
	"a.b.a": "z1",
	"a.b.b": "b3",
	"++|a.b.d": "d3",
	"a.b.e": "e3",
	"xyz.abc.five": "five5",
	"++|xyz.cba.three": "3three",
	"-|xyz.wild.three": "wild3",
	"some.digits.number": 12.234,
	"some.digits.int": 27,
	"some.digits.bigint": 9007199254740996
};

let rootProps: MutableProperties = null;
let childProps: MutableProperties = null;
let grandChildProps: MutableProperties = null;

beforeEach(() => {
	rootProps = new PropertiesImpl() as MutableProperties;
	rootProps.load(p1);

	childProps = rootProps.extend();
	childProps.load(p2);

	grandChildProps = childProps.extend();
	grandChildProps.load(p3);
});

afterEach(() => {
	grandChildProps.clear();
	grandChildProps = null;

	childProps.clear();
	childProps = null;

	rootProps.clear();
	rootProps = null;
});

test("PropertiesImpl instantiates and available", () => {
	expect(rootProps).not.toBe(null);
	expect(childProps).not.toBe(null);
	expect(grandChildProps).not.toBe(null);
});

test("PropertiesImpl extend()", () => {
	const localSpec: MutableProperties = grandChildProps.extend();
	expect(localSpec).not.toBe(null);
	expect(localSpec.get("a.b.d")).toEqual("d3");
});

test("PropertiesImpl clear()", () => {
	expect(grandChildProps).not.toBe(null);
	grandChildProps.clear();
	expect(grandChildProps.get("a.b.e")).toEqual(null);
});

test("Immutable root tier prop", () => {
	expect(grandChildProps.get("a.b.a")).toEqual("a1");
});

test("Immutable 2nd tier prop override of root with override attempt in 3rd tier", () => {
	expect(grandChildProps.get("a.b.b")).toEqual("b2");
});

test("Normal prop override of root with NO attempt in the 3rd tier", () => {
	expect(grandChildProps.get("a.b.c")).toEqual("c2");
});

test("Normal prop added in 2nd tier and overridden in the 3rd tier.", () => {
	expect(grandChildProps.get("a.b.d")).toEqual("d3");
});

test("Property added in the 3rd tier and no overrides.", () => {
	expect(grandChildProps.get("a.b.d")).toEqual("d3");
});

test("Proprty getAsString(key: string): string", () => {
	expect(grandChildProps.getAsString("zyx2")).toBe(null);
	expect(grandChildProps.getAsString("a.b.d")).toEqual("d3");
	expect(grandChildProps.getAsString("zyx")).toEqual("{\"a\":1,\"b\":2,\"c\":3}");
	expect(grandChildProps.getAsString("some.digits.number")).toBe("12.234");
	expect(grandChildProps.getAsString("some.digits.int")).toBe("27");
	expect(grandChildProps.getAsString("some.digits.bigint")).toBe("9007199254740996");
});

test("Property isTruthy(key: string): boolean", () => {
	expect(grandChildProps.isTruthy("a.b.d")).toBe(true);
	expect(grandChildProps.isTruthy("a.b.Z")).toBe(false);
});

test("Property isDefined(key: string): boolean", () => {
	expect(grandChildProps.isDefined("a.b.d")).toBe(true);
	expect(grandChildProps.isDefined("a.b.Z")).toBe(false);
});

test("Property removal: ", () => {
	const keyA: string = "xyz.cba.three";
	const keyB: string = "xyz.wild.three";
	grandChildProps.remove(keyA);
	const aResult: PropFlagVals = grandChildProps.existingPropertyAttributes(keyA);
	expect(aResult).toBe(null);
	grandChildProps.remove(keyB);
	const bResult: PropFlagVals = grandChildProps.existingPropertyAttributes(keyB);
	expect(bResult.delete).toBe(false);
});

const abFam: string = "a.b.";
const xyzFam: string = `xyz`;
const abcFam: string = `${xyzFam}.abc`;
const cbaFam: string = `${xyzFam}.cba`;
const wildFam: string = `${xyzFam}.wild`;

test(`${abFam} family property group: keyFamilyPropertyNames(${abFam})`, () => {
	const abFamExpect: string[] = "a.b.b,a.b.c,a.b.d,a.b.e".split(",");
	const abFamAllExpect: string[] = "a.b.a,a.b.b,a.b.c,a.b.d,a.b.e".split(",");
	const abFamGrp: string[] = grandChildProps.keyFamilyPropertyNames(abFam);
	const abFamGrpAll: string[] = grandChildProps.keyFamilyPropertyNames(abFam, true);

	expect(abFamGrp).toEqual(abFamExpect);
	expect(abFamGrpAll).toEqual(abFamAllExpect);
});

test(`${xyzFam} family property group: keyFamilyPropertyNames(${xyzFam})`, () => {
	const xyzFamExpect: string[] = "xyz.abc.two,xyz.cba.two,xyz.wild.one,xyz.abc.three,xyz.abc.four,xyz.wild.two,xyz.abc.five,xyz.cba.three".split(",");
	const xyzFamAllExpect: string[] = "xyz.abc.one,xyz.abc.two,xyz.cba.one,xyz.cba.two,xyz.wild.one,xyz.abc.three,xyz.abc.four,xyz.wild.two,xyz.abc.five,xyz.cba.three,xyz.wild.three".split(",");
	const xyzFamGrp: string[] = grandChildProps.keyFamilyPropertyNames(xyzFam);
	const xyzFamGrpAll: string[] = grandChildProps.keyFamilyPropertyNames(xyzFam, true);
	expect(xyzFamGrp).toEqual(xyzFamExpect);
	expect(xyzFamGrpAll).toEqual(xyzFamAllExpect);
});

test(`${abcFam} family property group: keyFamilyPropertyNames(${abcFam})`, () => {
	const abcFamExpect: string[] = "xyz.abc.two,xyz.abc.three,xyz.abc.four,xyz.abc.five".split(",");
	const abcFamAllExpect: string[] = "xyz.abc.one,xyz.abc.two,xyz.abc.three,xyz.abc.four,xyz.abc.five".split(",");
	const abcFamGrp: string[] = grandChildProps.keyFamilyPropertyNames(abcFam);
	const abcFamGrpAll: string[] = grandChildProps.keyFamilyPropertyNames(abcFam, true);
	expect(abcFamGrp).toEqual(abcFamExpect);
	expect(abcFamGrpAll).toEqual(abcFamAllExpect);
});

test(`${cbaFam} family property group: keyFamilyPropertyNames(${cbaFam})`, () => {
	const cbaFamExpect: string[] = "xyz.cba.two,xyz.cba.three".split(",");
	const cbaFamAllExpect: string[] = "xyz.cba.one,xyz.cba.two,xyz.cba.three".split(",");
	const cbaFamGrp: string[] = grandChildProps.keyFamilyPropertyNames(cbaFam);
	const cbaFamGrpAll: string[] = grandChildProps.keyFamilyPropertyNames(cbaFam, true);
	expect(cbaFamGrp).toEqual(cbaFamExpect);
	expect(cbaFamGrpAll).toEqual(cbaFamAllExpect);
});

test(`${wildFam} family property group: keyFamilyPropertyNames(${wildFam})`, () => {
	const wildFamExpect: string[] = "xyz.wild.one,xyz.wild.two".split(",");
	const wildFamAllExpect: string[] = "xyz.wild.one,xyz.wild.two,xyz.wild.three".split(",");
	const wildFamGrp: string[] = grandChildProps.keyFamilyPropertyNames(wildFam);
	const wildFamGrpAll: string[] = grandChildProps.keyFamilyPropertyNames(wildFam, true);
	expect(wildFamGrp).toEqual(wildFamExpect);
	expect(wildFamGrpAll).toEqual(wildFamAllExpect);
});
