import { Component, builder } from "Component";
import { Module } from "interface/Module";
import { assertNullGuarded } from "./TestUtils";
import { spy, verify } from "ts-mockito";

const ROOT_TEMPLATE: string = "<div></div>";

class TestComponent extends Component {
	private count: number = 0;

	constructor() {
		super(ROOT_TEMPLATE);
	}

	public incrementCount(span?: number) {
		this.count += span | 1;
	}

	public getCount(): number {
		return this.count;
	}
}

test("Constructor null argument", () => {
	assertNullGuarded("rootSelector", () => builder(null));
});

test("withComponentBefore(id: string, moduleName?: string)", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	wkBuilder.withComponentBefore("seg:menu");
	verify(spyBuilder.withComponentBefore("seg:menu")).once();
});

test("withComponentAFter(id: string, moduleName?: string)", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	wkBuilder.withComponentAfter("seg:footer");
	verify(spyBuilder.withComponentAfter("seg:footer")).once();
});

test("withComponent(id: string, moduleName?: string)", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	wkBuilder.withComponent("seg:main");
	verify(spyBuilder.withComponent("seg:main")).once();
});

test.skip("withInitializer(callback: () => void)", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	wkBuilder.withInitializer(function() {
		this.setComponentFromRegistry("pg:main");
	});
	verify(spyBuilder.withInitializer(function() {
		this.setComponentFromRegistry("pg:main");
	})).once();
});

test("with logging levels", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	wkBuilder.withTraceLogging();
	verify(spyBuilder.withTraceLogging()).once();
	wkBuilder.withDebugLogging();
	verify(spyBuilder.withDebugLogging()).once();
	wkBuilder.withInfoLogging();
	verify(spyBuilder.withInfoLogging()).once();
	wkBuilder.withWarnLogging();
	verify(spyBuilder.withWarnLogging()).once();
	wkBuilder.withErrorLogging();
	verify(spyBuilder.withErrorLogging()).once();
	wkBuilder.withFatalLogging();
	verify(spyBuilder.withFatalLogging()).once();
	wkBuilder.withLoggingDisabled();
	verify(spyBuilder.withLoggingDisabled()).once();
});

test("getModule(name: string): Module", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	const defMod: Module = wkBuilder.getModule("bubbalicious");
	verify(spyBuilder.getModule("bubbalicious")).once();
	expect(defMod).not.toBeNull();
});

test("getDefaultModule(): Module", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	const defMod: Module = wkBuilder.getDefaultModule();
	verify(spyBuilder.getDefaultModule()).once();
	expect(defMod).not.toBeNull();
});
