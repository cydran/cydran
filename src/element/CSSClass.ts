import ElementMediator from "@/element/ElementMediator";
import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";

class CSSClass extends ElementMediator<any, HTMLElement, any> {

	public static readonly KEY: string = "class";

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	private onTargetChange(previous: any, current: any): void {
		const oldClasses: string[] = (this.getEl().className || "").trim().split(" ");
		const newClasses: string[] = [];
		const map: any = current || {};

		for (const value of oldClasses) {
			if (!map.hasOwnProperty(value)) {
				newClasses.push(value);
			}
		}

		for (const key in map) {
			if (map.hasOwnProperty(key) && !!map[key]) {
				newClasses.push(key);
			}
		}

		this.getEl().className = newClasses.join(" ");
	}

}

ElementMediatorFactories.register(CSSClass.KEY, ["*"], CSSClass);

export default CSSClass;
