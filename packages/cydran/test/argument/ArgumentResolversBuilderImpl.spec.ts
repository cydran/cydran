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
	expect(builder).not.toBeNull();
});

test("with", () => {
	const wkId: string = "xyz";
	const wkSpy = jest.spyOn(builder, 'with');
	builder.with(wkId)
	expect(wkSpy).toBeCalledTimes(1);
});

test("withProvider", () => {
	const wkId: string = "xyz";
	const wkSpy = jest.spyOn(builder, 'withProvider');
	builder.withProvider(wkId)
	expect(wkSpy).toBeCalledTimes(1);
});

test("withPropertyProvider", () => {
	const wkId: string = "xyz";
	const wkSpy = jest.spyOn(builder, 'withPropertyProvider');
	builder.withPropertyProvider(wkId)
	expect(wkSpy).toBeCalledTimes(1);
});

test("withInstanceIdProvider", () => {
	const wkSpy = jest.spyOn(builder, 'withInstanceIdProvider');
	builder.withInstanceIdProvider();
	expect(wkSpy).toBeCalledTimes(1);
});

test("withLogger", () => {
	const wkSpy = jest.spyOn(builder, 'withLogger');
	builder.withLogger("mylogger");
	expect(wkSpy).toBeCalledTimes(1);
});

test("withLoggerOutputStrategy", () => {
	const wkSpy = jest.spyOn(builder, 'withLoggerOutputStrategy');
	builder.withLoggerOutputStrategy("mylogger", ()=>{});
	expect(wkSpy).toBeCalledTimes(1);
});

test("withPubSub", () => {
	const wkSpy = jest.spyOn(builder, 'withPubSub');
	builder.withPubSub();
	expect(wkSpy).toBeCalledTimes(1);
});

test("withInstanceId", () => {
	const wkSpy = jest.spyOn(builder, 'withInstanceId');
	builder.withInstanceId();
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
