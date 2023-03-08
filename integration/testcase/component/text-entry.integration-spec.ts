/**
 * @jest-environment jsdom
 */
import { Component, Stage, StageImpl } from 'cydran';
import { getByText, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

const TEMPLATE: string = `<div>
	<input type="text" c-model="m().firstName" id="firstName">
	<input type="text" c-model="m().lastName" id="lastName">
	<button c-onclick="m().handleClick()">Click Me</button>
</div>`;

class TestComponent extends Component {

	private firstName: string;

	private lastName: string;

	constructor() {
		super(TEMPLATE);
		this.firstName = "";
		this.lastName = "";
	}

	public handleClick(): void {
		this.lastName = this.firstName;
	}

}

function enterText(element: HTMLInputElement, text: string): void {
	element.value = text;
	fireEvent.input(element);
}

test.skip("Testcase should pass", () => {
	const stage: Stage = new StageImpl("body", {"cydran.logging.level": "WARN"});
	stage.start();

	expect(stage.isStarted()).toEqual(true);

	stage.setComponent(new TestComponent());

	enterText(document.getElementById("firstName") as HTMLInputElement, "foo");

	getByText(document.body, "Click Me").click();

	const lastNameInput = document.getElementById("lastName");
	expect(lastNameInput.value).toEqual("foo");
});
