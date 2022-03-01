 import { builder, Ids, Stage, Component } from 'cydran';

const TEMPLATE: string = `<div>
	<script type="cydran/region" c-region-name="left"></script>
	<script type="cydran/region" c-region-name="right"></script>
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

test("Component child lifecycle - Mount, Unmount and Remount - Parent/Child/Grandchild", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body", {"cydran.logging.level": "WARN"}).build();
	stage.start();

	expect(stage.isStarted()).toEqual(true);

	const parent: CountingComponent = new CountingComponent();
	const leftChild: CountingComponent = new CountingComponent();
	const leftLeftChild: CountingComponent = new CountingComponent();
	const leftRightChild: CountingComponent = new CountingComponent();
	const rightChild: CountingComponent = new CountingComponent();
	const rightLeftChild: CountingComponent = new CountingComponent();
	const rightRightChild: CountingComponent = new CountingComponent();

	expectCounts(parent, 0, 0, 0);
	expectCounts(leftChild, 0, 0, 0);
	expectCounts(leftLeftChild, 0, 0, 0);
	expectCounts(leftRightChild, 0, 0, 0);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	leftChild.setChild("left", leftLeftChild);
	leftChild.setChild("right", leftRightChild);

	rightChild.setChild("left", rightLeftChild);
	rightChild.setChild("right", rightRightChild);

	expectCounts(parent, 0, 0, 0);
	expectCounts(leftChild, 0, 0, 0);
	expectCounts(leftLeftChild, 0, 0, 0);
	expectCounts(leftRightChild, 0, 0, 0);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	parent.setChild("left", leftChild);

	expectCounts(parent, 0, 0, 0);
	expectCounts(leftChild, 0, 0, 0);
	expectCounts(leftLeftChild, 0, 0, 0);
	expectCounts(leftRightChild, 0, 0, 0);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	stage.setComponent(parent);

	expectCounts(parent, 1, 0, 0);
	expectCounts(leftChild, 1, 0, 0);
	expectCounts(leftLeftChild, 1, 0, 0);
	expectCounts(leftRightChild, 1, 0, 0);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	stage.setComponent(null);

	expectCounts(parent, 1, 1, 0);
	expectCounts(leftChild, 1, 1, 0);
	expectCounts(leftLeftChild, 1, 1, 0);
	expectCounts(leftRightChild, 1, 1, 0);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	stage.setComponent(parent);

	expectCounts(parent, 1, 1, 1);
	expectCounts(leftChild, 1, 1, 1);
	expectCounts(leftLeftChild, 1, 1, 1);
	expectCounts(leftRightChild, 1, 1, 1);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	stage.setComponent(null);

	expectCounts(parent, 1, 2, 1);
	expectCounts(leftChild, 1, 2, 1);
	expectCounts(leftLeftChild, 1, 2, 1);
	expectCounts(leftRightChild, 1, 2, 1);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	parent.setChild("right", rightChild);

	expectCounts(parent, 1, 2, 1);
	expectCounts(leftChild, 1, 2, 1);
	expectCounts(leftLeftChild, 1, 2, 1);
	expectCounts(leftRightChild, 1, 2, 1);
	expectCounts(rightChild, 0, 0, 0);
	expectCounts(rightLeftChild, 0, 0, 0);
	expectCounts(rightRightChild, 0, 0, 0);

	stage.setComponent(parent);

	expectCounts(parent, 1, 2, 2);
	expectCounts(leftChild, 1, 2, 2);
	expectCounts(leftLeftChild, 1, 2, 2);
	expectCounts(leftRightChild, 1, 2, 2);
	expectCounts(rightChild, 1, 0, 0);
	expectCounts(rightLeftChild, 1, 0, 0);
	expectCounts(rightRightChild, 1, 0, 0);

	stage.setComponent(null);

	expectCounts(parent, 1, 3, 2);
	expectCounts(leftChild, 1, 3, 2);
	expectCounts(leftLeftChild, 1, 3, 2);
	expectCounts(leftRightChild, 1, 3, 2);
	expectCounts(rightChild, 1, 1, 0);
	expectCounts(rightLeftChild, 1, 1, 0);
	expectCounts(rightRightChild, 1, 1, 0);

	stage.setComponent(parent);

	expectCounts(parent, 1, 3, 3);
	expectCounts(leftChild, 1, 3, 3);
	expectCounts(leftLeftChild, 1, 3, 3);
	expectCounts(leftRightChild, 1, 3, 3);
	expectCounts(rightChild, 1, 1, 1);
	expectCounts(rightLeftChild, 1, 1, 1);
	expectCounts(rightRightChild, 1, 1, 1);
});
