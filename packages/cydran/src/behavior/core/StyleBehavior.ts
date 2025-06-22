import { isDefined } from "util/Utils";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class StyleBehavior extends AbstractValueBehavior<unknown, HTMLElement, unknown> {

	protected onChange(previous: unknown, current: unknown): void {
		if (!isDefined(current)) {
			return;
		}

		for (const key of Object.keys(current)) {
			this.getEl().style[key] = current[key] + "";
		}
	}

}

export default StyleBehavior;
