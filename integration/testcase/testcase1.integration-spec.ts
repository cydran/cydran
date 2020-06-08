
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { builder, Stage, Component } from "cydran";

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

test("Testcase should pass", () => {

	builder("body")
		.withWarnLogging()
		.withInitializer((stage: Stage) => {
			stage.setComponent(new TestComponent());
			expect(document.body.innerHTML).toEqual("<div>Hello World!</div>");
			stage.dispose();
		})
		.build()
		.start();
});
