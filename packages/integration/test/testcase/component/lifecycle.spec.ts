import { Stage, Component, create, Nestable } from "@cydran/cydran";
import { describe, expect, test } from '@jest/globals';

class CountingComponent extends Component {

	private mounts: number;

	private unmounts: number;

	private remounts: number;

	constructor() {
		super("<div></div>");
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

describe("Component lifecycle - Mount, Unmount and Remount", () => {

	test("Component child lifecycle - Mount, Unmount and Remount - Child level", () => {
		document.body.innerHTML = '<div></div>';

		const stage: Stage = create("body", { "cydran.logging.level": "WARN" });

		stage.start();

		expect(stage.isStarted()).toEqual(true);

		const component: CountingComponent = new CountingComponent();

		expect(component.getMounts()).toEqual(0);
		expect(component.getUnmounts()).toEqual(0);
		expect(component.getRemounts()).toEqual(0);

		stage.setComponent(component);

		expect(component.getMounts()).toEqual(1);
		expect(component.getUnmounts()).toEqual(0);
		expect(component.getRemounts()).toEqual(0);

		component.reset();

		stage.setComponent(null as unknown as Nestable);

		expect(component.getMounts()).toEqual(0);
		expect(component.getUnmounts()).toEqual(1);
		expect(component.getRemounts()).toEqual(0);

		component.reset();

		stage.setComponent(component);

		expect(component.getMounts()).toEqual(0);
		expect(component.getUnmounts()).toEqual(0);
		expect(component.getRemounts()).toEqual(1);

		component.reset();

		stage.setComponent(null as unknown as Nestable);

		expect(component.getMounts()).toEqual(0);
		expect(component.getUnmounts()).toEqual(1);
		expect(component.getRemounts()).toEqual(0);
		component.reset();

		stage.setComponent(component);

		expect(component.getMounts()).toEqual(0);
		expect(component.getUnmounts()).toEqual(0);
		expect(component.getRemounts()).toEqual(1);
	});

});
