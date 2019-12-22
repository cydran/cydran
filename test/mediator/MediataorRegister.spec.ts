import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when, spy } from "ts-mockito";
import { Mvvm, Component } from "@/Core";

import CSSClass from "@/mediator/CSSClass";

class TestC extends Component {
	private info: string;

	constructor() {
		super("<div></div>");
	};

	protected init(): void {
		this.info = "Bummer!";
	}
}

describe("Mediator tests", () => {

	it("new CSSClass instance", () => {
		//const mvvmSpy: Mvvm = spy(Mvvm);
		Mvvm.register(CSSClass.KEY, ["*"], CSSClass);
		//verify(mvvmSpy.register(CSSClass.KEY, ["*"], CSSClass)).once();
	});

	/*

import Checked from "./Checked";
Mvvm.register(Checked.KEY, ["input"], Checked);

import CSSClass from "./CSSClass";
Mvvm.register(CSSClass.KEY, ["*"], CSSClass);

import Content from "./Content";
Mvvm.register(Content.KEY, ["*"], Content);

import Enabled from "./Enabled";
Mvvm.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "./ReadOnly";
Mvvm.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "./Style";
Mvvm.register(Style.KEY, ["*"], Style);

import ForceFocus from "./ForceFocus";
Mvvm.register(ForceFocus.KEY, ["*"], ForceFocus);

import MultiSelectValueModel from "./MultiSelectValueModel";
Mvvm.register(MultiSelectValueModel.KEY, ["select"], MultiSelectValueModel);

import ValuedModel from "./ValuedModel";
Mvvm.register(ValuedModel.KEY, ["textarea"], ValuedModel);

import InputValueModel from "./InputValueModel";
Mvvm.register(InputValueModel.KEY, ["input"], InputValueModel);

import Visible from "./Visible";
Mvvm.register(Visible.KEY, ["*"], Visible);

import Repeat from "./Repeat";
Mvvm.register("repeat", ["*"], Repeat);
	 */
});
