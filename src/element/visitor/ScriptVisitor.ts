import { CYDRAN_SCRIPT_PREFIX } from "Constants";
import ElementVisitor from "element/visitor/ElementVisitor";
import { startsWith, removeFromBeginning, isDefined } from "util/Utils";
import VISITORS from "element/visitor/Visitors";
import { Mvvm } from "internals/Shuttle";

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {
	public visit(
		element: HTMLScriptElement,
		context: Mvvm,
		consumer: (element: HTMLElement | Text | Comment) => void,
		topLevel: boolean
	): void {
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