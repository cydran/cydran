import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import { isDefined } from "util/Utils";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class StyleBehavior extends AbstractValueBehavior<any, HTMLElement, any> {

	protected onChange(previous: any, current: any): void {
		if (!isDefined(current)) {
			return;
		}

		for (const key in current) {
			if (!current.hasOwnProperty(key)) {
				continue;
			}

			this.getEl().style[key] = current[key] + "";
		}
	}

}

BehaviorsRegistry.register("style", ["*"], StyleBehavior);

export default StyleBehavior;
