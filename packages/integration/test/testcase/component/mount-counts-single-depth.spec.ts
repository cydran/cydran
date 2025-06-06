import { Stage, Component, create, Nestable } from "@cydran/cydran";
import { describe, expect, test } from '@jest/globals';

const TEMPLATE: string = `<div>
	<c-region name="left"></c-region>
	<c-region name="right"></c-region>
</div>`;

class CountingComponent extends Component {

	private mounts: number;

	private unmounts: number;

	private remounts: number;

	constructor() {
		super(TEMPLATE);
		this.reset();
	}

	public onMount(): void {
		this.mounts++;
	}

	public onUnmount(): void {
		this.unmounts++;
	}

	public onRemount(): void {
		this.remounts++;
	}

	public getMounts(): number {
		return this.mounts;
	}

	public getUnmounts(): number {
		return this.unmounts;
	}

	public getRemounts(): number {
		return this.remounts;
	}

	public reset(): void {
		this.mounts = 0;
		this.unmounts = 0;
		this.remounts = 0;
	}

}

function expectCounts(component: CountingComponent, mounts: number, unmounts: number, remounts: number): void {
	expect(component.getMounts()).toEqual(mounts);
	expect(component.getUnmounts()).toEqual(unmounts);
	expect(component.getRemounts()).toEqual(remounts);
}

describe("Component child lifecycle - Mount, Unmount and Remount - Parent/Child", () => {

	test.skip("Component child lifecycle - Mount, Unmount and Remount - Parent/Child", () => {
		document.body.innerHTML = '<div></div>';

		const stage: Stage = create("body", { "cydran.logging.level": "WARN" });
		stage.start();

		expect(stage.isStarted()).toEqual(true);

		const parent: CountingComponent = new CountingComponent();
		const leftChild: CountingComponent = new CountingComponent();
		const rightChild: CountingComponent = new CountingComponent();

		expectCounts(parent, 0, 0, 0);
		expectCounts(leftChild, 0, 0, 0);
		expectCounts(rightChild, 0, 0, 0);

		parent.$c().regions().set("left", leftChild);
		parent.$c().regions().set("right", rightChild);

		expectCounts(parent, 0, 0, 0);
		expectCounts(leftChild, 0, 0, 0);
		expectCounts(rightChild, 0, 0, 0);

		stage.setComponent(parent);

		expectCounts(parent, 1, 0, 0);
		expectCounts(leftChild, 1, 0, 0);
		expectCounts(rightChild, 1, 0, 0);

		parent.reset();
		leftChild.reset();
		rightChild.reset();

		stage.setComponent(null as unknown as Nestable);

		expectCounts(parent, 0, 1, 0);
		expectCounts(leftChild, 0, 1, 0);
		expectCounts(rightChild, 0, 1, 0);

		parent.reset();
		leftChild.reset();
		rightChild.reset();

		stage.setComponent(parent);

		expectCounts(parent, 0, 0, 1);
		expectCounts(leftChild, 0, 0, 1);
		expectCounts(rightChild, 0, 0, 1);

		parent.reset();
		leftChild.reset();
		rightChild.reset();

		stage.setComponent(null as unknown as Nestable);

		expectCounts(parent, 0, 1, 0);
		expectCounts(leftChild, 0, 1, 0);
		expectCounts(rightChild, 0, 1, 0);

		parent.reset();
		leftChild.reset();
		rightChild.reset();

		stage.setComponent(parent);

		expectCounts(parent, 0, 0, 1);
		expectCounts(leftChild, 0, 0, 1);
		expectCounts(rightChild, 0, 0, 1);
	});

});
