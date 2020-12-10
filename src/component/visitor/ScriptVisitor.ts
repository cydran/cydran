import { CYDRAN_SCRIPT_PREFIX } from "Constants";
import ElementVisitor from "component/visitor/ElementVisitor";
import { startsWith, removeFromBeginning, isDefined } from "util/Utils";
import VISITORS from "component/visitor/Visitors";
import ComponentInternals from "component/ComponentInternals";

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (!startsWith(element.type, CYDRAN_SCRIPT_PREFIX)) {
			return;
		}

		const type: string = removeFromBeginning(element.type, CYDRAN_SCRIPT_PREFIX);
		const visitor: ElementVisitor<HTMLScriptElement, any> = VISITORS[type];

		if (isDefined(visitor)) {
			visitor.visit(element, context, consumer, topLevel);
		}
	}
}

export default ScriptVisitor;
