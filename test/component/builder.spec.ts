import { assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Component from 'component/Component';
import { builder } from 'const/Builder';
import Module from 'module/Module';

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

test("getDefaultModule(): Module", () => {
	const wkBuilder = builder("html");
	const spyBuilder = spy(wkBuilder);
	const defMod: Module = wkBuilder.getDefaultModule();
	verify(spyBuilder.getDefaultModule()).once();
	expect(defMod).not.toBeNull();
});
