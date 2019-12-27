import { Component, Mvvm } from "@/Core";
import Scope from "@/Scope";
import ScopeImpl from "@/ScopeImpl";

import Checked from "@/mediator/Checked";
import Content from "@/mediator/Content";
import CSSClass from "@/mediator/CSSClass";
import Enabled from "@/mediator/Enabled";
import ForceFocus from "@/mediator/ForceFocus";
import InputValueModel from "@/mediator/InputValueModel";
import MultiSelectValueModel from "@/mediator/MultiSelectValueModel";
import ReadOnly from "@/mediator/ReadOnly";
import Style from "@/mediator/Style";
import ValuedModel from "@/mediator/ValuedModel";
import Visible from "@/mediator/Visible";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

const classes: any[] = [
	Checked, CSSClass, Content, Enabled, ReadOnly, Style, ForceFocus, MultiSelectValueModel, ValuedModel, InputValueModel, Visible
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
			Mvvm.register(m.KEY, ["*"], m);
			// verify(mvvmSpy.register(CSSClass.KEY, ["*"], CSSClass)).once();
		});

	});
});
