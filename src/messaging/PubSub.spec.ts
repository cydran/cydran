import { Component } from "@/Core";
import PubSub from "@/messaging/PubSub";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

class TestComponent extends Component {

	private wkvalue: string;

	constructor() {
		super("<div>{{m().wkvalue}}</div>");
	}

	protected init() {
		this.wkvalue = "Test Value";
	}
}

describe("PubSub tests", () => {
	it.skip("Instance of PubSub not null", () => {
		const tcomp: TestComponent = new TestComponent();
		assert.isTrue(false);
	});

});
