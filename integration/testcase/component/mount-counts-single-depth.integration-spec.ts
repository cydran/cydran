 import { builder, Stage, Component } from 'cydran';

const TEMPLATE: string = `<div>
	<script type="cydran/region" c:region:name="left"></script>
	<script type="cydran/region" c:region:name="right"></script>
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

test("Component child lifecycle - Mount, Unmount and Remount - Parent/Child", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body")
		.withWarnLogging()
		.build();

	stage.start();

	expect(stage.isStarted()).toEqual(true);

	const parent: CountingComponent = new CountingComponent();
	const leftChild: CountingComponent = new CountingComponent();
	const rightChild: CountingComponent = new CountingComponent();

	expectCounts(parent, 0, 0, 0);
	expectCounts(leftChild, 0, 0, 0);
	expectCounts(rightChild, 0, 0, 0);

	parent.setChild("left", leftChild);
	parent.setChild("right", rightChild);

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

	stage.setComponent(null);

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

	stage.setComponent(null);

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
