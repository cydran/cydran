import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import ArgumentResolversBuilderImpl from "argument/ArgumentResolversBuilderImpl";
import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';

let builder: ArgumentsResolversBuilder = null;

describe("ArgumentResolversBuilderImpl", () => {

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

	test("withTransmitter", () => {
		const wkSpy = jest.spyOn(builder, 'withTransmitter');
		builder.withTransmitter();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("withInstanceId", () => {
		const wkSpy = jest.spyOn(builder, 'withInstanceId');
		builder.withInstanceId();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("withFunction", () => {
		const wkFn: () => any = () => true;
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
		const scopeKey: string = 'cydranTestVersion';
		const wkSpy = jest.spyOn(builder, 'withScopeItem');
		builder.withScopeItem(scopeKey);
		expect(wkSpy).toBeCalledTimes(1);
	});

});
