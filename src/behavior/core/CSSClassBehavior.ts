import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class CSSClass extends AbstractValueBehavior<any, HTMLElement, any> {

	protected onChange(previous: any, current: any): void {
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

BehaviorsRegistry.register("class", ["*"], CSSClass);

export default CSSClass;
