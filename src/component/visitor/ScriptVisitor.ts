import { CYDRAN_SCRIPT_PREFIX } from "Constants";
import ElementVisitor from "component/visitor/ElementVisitor";
import { startsWith, removeFromBeginning, isDefined } from "util/Utils";
import ComponentInternals from "component/ComponentInternals";
import SimpleMap from "interface/SimpleMap";
import RegionVisitor from "component/visitor/RegionVisitor";
import InstanceServices from "context/InstanceServices";

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {

	private visitors: SimpleMap<ElementVisitor<HTMLScriptElement, any>>;

	constructor(cydranContext: InstanceServices) {
		this.visitors = {
			region: new RegionVisitor(cydranContext)
		};
	}

	public visit(element: HTMLScriptElement, context: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (!startsWith(element.type, CYDRAN_SCRIPT_PREFIX)) {
			return;
		}

		const type: string = removeFromBeginning(element.type, CYDRAN_SCRIPT_PREFIX);
		const visitor: ElementVisitor<HTMLScriptElement, any> = this.visitors[type];

		if (isDefined(visitor)) {
			visitor.visit(element, context, consumer, topLevel);
		}
	}
}

export default ScriptVisitor;
