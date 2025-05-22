import { argumentsBuilder, Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, test } from '@jest/globals';

const EXPECTED_BODY_BEFORE: string = `<!--SS--><!--SE--><div>
				<!--#-->The test component<!--#-->
				<button data-testid="the-button">Click Me</button>
				<!--#-->first<!--#-->
				<!--#-->second<!--#-->
				<!--#-->third<!--#-->
			</div><!--SS--><!--SE-->`;

const EXPECTED_BODY_AFTER: string = `<!--SS--><!--SE--><div>
				<!--#-->The test component that was clicked<!--#-->
				<button data-testid="the-button">Click Me</button>
				<!--#-->first<!--#-->
				<!--#-->second<!--#-->
				<!--#-->third<!--#-->
			</div><!--SS--><!--SE-->`;

class TestComponent extends Component {

	private name: string;

	constructor() {
		super(`
			<div>
				{{m().name}}
				<button c-onclick="m().handleClick()" data-testid="the-button">Click Me</button>
				<c-region path="first"></c-region>
				<c-region path="second"></c-region>
				<c-region path="third"></c-region>
			</div>
		`);

		this.name = "The test component";
	}

	public handleClick(): void {
		this.name = "The test component that was clicked";
	}

}

class ChildComponent extends Component {

	private name: string;

	constructor(name: string) {
		super(`
			<div>
				{{m().name}}
			</div>
		`);

		this.name = name;
	}

}

describe("Bug 753 - Component initialization at root level is broken", () => {

	test.skip("Root component is populated with active behaviors", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.registerPrototype("first", ChildComponent as any, argumentsBuilder().withConstant("first").build());
		harness.registerPrototype("second", ChildComponent as any, argumentsBuilder().withConstant("second").build());
		harness.registerPrototype("third", ChildComponent as any, argumentsBuilder().withConstant("third").build());
		harness.start();
		harness.expectBody().toEqual(EXPECTED_BODY_BEFORE);
		harness.forTestId("the-button").query().click();
		harness.expectBody().toEqual(EXPECTED_BODY_AFTER);
	});

});
