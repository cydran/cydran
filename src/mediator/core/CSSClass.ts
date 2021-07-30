import Factories from "internals/Factories";
import AbstractElementMediator from "mediator/AbstractElementMediator";

class CSSClass extends AbstractElementMediator<any, HTMLElement, any> {

	public onMount(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		} else {
			this.onTargetChange(null, this.getModelMediator().get());
		}
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

Factories.register("class", ["*"], CSSClass);

export default CSSClass;
