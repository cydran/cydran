import Component from "@/component/Component";
import Module from "@/module/Module";
import { builder, StageBuilder } from "@/stage/Stage";
import { assertNullGuarded } from "@/util/TestUtils";
import { JSDOM } from "jsdom";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { spy, verify } from "ts-mockito";
import Properties from "@/config/Properties";

Properties.setWindow(new JSDOM("<html></html>").window);

const HTML: string = "html";
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

describe("stage builder tests", () => {

	it("Constructor null argument", () => {
		assertNullGuarded("rootSelector", () => builder(null));
	});

	it("withComponentBefore(id: string, moduleName?: string)", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		wkBuilder.withComponentBefore("seg:menu");
		verify(spyBuilder.withComponentBefore("seg:menu")).once();
	});

	it("withComponentAFter(id: string, moduleName?: string)", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		wkBuilder.withComponentAfter("seg:footer");
		verify(spyBuilder.withComponentAfter("seg:footer")).once();
	});

	it("withComponent(id: string, moduleName?: string)", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		wkBuilder.withComponent("seg:main");
		verify(spyBuilder.withComponent("seg:main")).once();
	});

	xit("withInitializer(callback: () => void)", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		wkBuilder.withInitializer(function() {
			this.setComponentFromRegistry("pg:main");
		});
		verify(spyBuilder.withInitializer(function() {
			this.setComponentFromRegistry("pg:main");
		})).once();
	});

	it("with logging levels", () => {
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

	it("getModule(name: string): Module", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		const defMod: Module = wkBuilder.getModule("bubbalicious");
		verify(spyBuilder.getModule("bubbalicious")).once();
		assert.isNotNull(defMod);
	});

	it("getDefaultModule(): Module", () => {
		const wkBuilder = builder("html");
		const spyBuilder = spy(wkBuilder);
		const defMod: Module = wkBuilder.getDefaultModule();
		verify(spyBuilder.getDefaultModule()).once();
		assert.isNotNull(defMod);
	});
});
