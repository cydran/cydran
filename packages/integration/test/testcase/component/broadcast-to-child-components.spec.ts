import { Component, To } from "@cydran/cydran";
import { describe, test } from '@jest/globals';
import { Harness } from "@cydran/testsupport";

class TestComponent extends Component {

	private count: number;

	constructor() {
		super(`<div><p>{{m().count}}</p><c-region name="left"></c-region><c-region name="right"></c-region></div>`);
		this.count = 0;
		this.$c().onMessage("updateChildren").forChannel("channelForChildren").invoke(this.incrementCount);
	}

	public onMount(): void {
		this.$c().regions().set("left", new ChildComponent());
		this.$c().regions().set("right", new ChildComponent());
	}

	public notifyChildren(): void {
		this.$c()
			.send("updateChildren", null)
			.onChannel("channelForChildren")
			.withPropagation(To.IMMEDIATE_CHILD_COMPONENTS);
	}

	private incrementCount(): void {
		this.count++;
	}

}

class ChildComponent extends Component {

	private count: number;

	constructor() {
		super(`<div><p>{{m().count}}</p><c-region name="left"></c-region><c-region name="right"></c-region></div>`);
		this.count = 0;
		this.$c().onMessage("updateChildren").forChannel("channelForChildren").invoke(this.incrementCount);
	}

	public onMount(): void {
		this.$c().regions().set("left", new GrandchildComponent());
		this.$c().regions().set("right", new GrandchildComponent());
	}

	private incrementCount(): void {
		this.count++;
	}

}

class GrandchildComponent extends Component {

	private count: number;

	constructor() {
		super(`<div><p>{{m().count}}</p></div>`);
		this.count = 0;
		this.$c().onMessage("updateChildren").forChannel("channelForChildren").invoke(this.incrementCount);
	}

	private incrementCount(): void {
		this.count++;
	}

}


describe("Broadcast to child components", () => {

	test("Only broadcast to immediate children", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.start();
		harness.expectBody().toEqual("<!--SS--><!--SE--><div><p><!--#-->0<!--#--></p><div><p><!--#-->0<!--#--></p><div><p><!--#-->0<!--#--></p></div><div><p><!--#-->0<!--#--></p></div></div><div><p><!--#-->0<!--#--></p><div><p><!--#-->0<!--#--></p></div><div><p><!--#-->0<!--#--></p></div></div></div><!--SS--><!--SE-->");
		harness.getComponent().notifyChildren();
		harness.expectBody().toEqual("<!--SS--><!--SE--><div><p><!--#-->0<!--#--></p><div><p><!--#-->1<!--#--></p><div><p><!--#-->0<!--#--></p></div><div><p><!--#-->0<!--#--></p></div></div><div><p><!--#-->1<!--#--></p><div><p><!--#-->0<!--#--></p></div><div><p><!--#-->0<!--#--></p></div></div></div><!--SS--><!--SE-->");
	});

});
