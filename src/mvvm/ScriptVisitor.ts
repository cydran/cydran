import { isDefined, requireValid } from "@/util/ObjectUtils";
import Mvvm from "@/mvvm/Mvvm";
import ElementVisitor from "@/dom/ElementVisitor";
import { startsWith, removeFromBeginning } from '@/util/StringUtils';
import SimpleMap from '@/pattern/SimpleMap';
import RegionVisitor from './RegionVisitor';
import { CYDRAN_SCRIPT_PREFIX } from "@/constant/Constants";

const VISITORS: SimpleMap<ElementVisitor<HTMLScriptElement, any>> = {
	region: new RegionVisitor()
};

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
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
