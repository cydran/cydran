import { StageImpl as StageContext, ChildContextImpl } from "context/RootContextImpl";
import Scope from "scope/Scope";
import { Stage } from "context/Context";

let specimen: ChildContextImpl;
let root: StageContext;

const childName: string = "child" as const;

beforeAll(() => {
	root = new StageContext("body", {});
});

beforeEach(() => {
	specimen = new ChildContextImpl(childName, root);
});

afterEach(() => {
	specimen = null;
});

test("expose", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "expose");
	expect(() => specimen.expose("something")).toThrowError();
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("getParent", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "getParent");
	expect(specimen.getParent()).toEqual(root);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("isStage", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "isStage");
	expect(specimen.isStage()).toBe(false);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("getProperties", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "getProperties");
	expect(specimen.getProperties()).not.toBe(null);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("getScope", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "getScope");
	const s: Scope = specimen.getScope();
	expect(s).not.toBe(null);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("getStage", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "getStage");
	const s: Stage = specimen.getStage();
	expect(s).toEqual(root);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test("getRegistry", () => {
	const wkSpy: ChildContextImpl = jest.spyOn(specimen, "getRegistry");
	expect(specimen.getRegistry()).not.toBe(null);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});