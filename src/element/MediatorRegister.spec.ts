import Checked from "@/element/Checked";
import CSSClass from "@/element/CSSClass";
import Enabled from "@/element/Enabled";
import ForceFocus from "@/element/ForceFocus";
import InputValueModel from "@/element/InputValueModel";
import MultiSelectValueModel from "@/element/MultiSelectValueModel";
import ReadOnly from "@/element/ReadOnly";
import Style from "@/element/Style";
import ValuedModel from "@/element/ValuedModel";
import Visible from "@/element/Visible";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Component from "@/component/Component";
import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";

const classes: any[] = [
	Checked, CSSClass, Enabled, ReadOnly, Style, ForceFocus, MultiSelectValueModel, ValuedModel, InputValueModel, Visible
];

class TestC extends Component {
	private info: string;

	constructor() {
		super("<div></div>");
	}

	protected init(): void {
		this.info = "Bummer!";
	}
}

describe("Mediator tests", () => {
	const testComponent: TestC = new TestC();

	classes.forEach((m) => {

		it(m.name + " component registerd with Mvvm", () => {
			// const mvvmSpy: Mvvm = spy(Mvvm);
			ElementMediatorFactories.register(m.KEY, ["*"], m);
			// verify(mvvmSpy.register(CSSClass.KEY, ["*"], CSSClass)).once();
		});

	});
});
