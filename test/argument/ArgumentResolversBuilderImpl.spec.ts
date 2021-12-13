import { ArgumentsResolversBuilder } from "stage/Stage";
import ArgumentResolversBuilderImpl from "argument/ArgumentResolversBuilderImpl";

let builder: ArgumentsResolversBuilder = null;

beforeEach(() => {
	builder = new ArgumentResolversBuilderImpl();
});

afterEach(() => {
	builder = null;
});

test("builder is whole", () => {
	expect(builder).not.toBe(null);
});

test("with", () => {
	const wkId: string = "xyz";
	const wkSpy = jest.spyOn(builder, 'with');
	builder.with(wkId);
	expect(wkSpy).toBeCalledTimes(1);
});

test("withPubSub", () => {
	const wkSpy = jest.spyOn(builder, 'withPubSub');
	builder.withPubSub();
	expect(wkSpy).toBeCalledTimes(1);
});

test("withFunction", () => {
	const wkFn: Function = () => { return true; };
	const wkSpy = jest.spyOn(builder, 'withFunction');
	builder.withFunction(wkFn);
	expect(wkSpy).toBeCalledTimes(1);
});

test("withConstant", () => {
	const ABC: string = 'ABC';
	const wkSpy = jest.spyOn(builder, 'withConstant');
	builder.withConstant(ABC);
	expect(wkSpy).toBeCalledTimes(1);
});

test("withProperty", () => {
	const propName: string = 'cydran.test.version';
	const wkSpy = jest.spyOn(builder, 'withProperty');
	builder.withProperty(propName);
	expect(wkSpy).toBeCalledTimes(1);
});

test("withScopeItem", () => {
	const scopeKey: string = 'cydran.test.version';
	const wkSpy = jest.spyOn(builder, 'withScopeItem');
	builder.withScopeItem(scopeKey);
	expect(wkSpy).toBeCalledTimes(1);
});

test("validate", () => {
	const errMsg: string = 'something bad occurred';
	const wkSpy = jest.spyOn(builder, 'validate');
	builder.validate(() => { return errMsg; });
	expect(wkSpy).toBeCalledTimes(1);
});
