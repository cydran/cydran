import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import { requireNotNull } from "util/Utils";
import InstanceServices from "context/InstanceServices";

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	private cydranContext: InstanceServices;

	constructor(cydranContext: InstanceServices) {
		this.cydranContext = requireNotNull(cydranContext, "cydranContext");
	}

	public visit(element: HTMLScriptElement, context: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const region: RegionBehavior = new RegionBehavior(context);

		const deps: BehaviorDependencies = {
			parent: context,
			el: element,
			expression: "",
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: context.getExtractor().asTypePrefix("region"),
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: true,
			cydranContext: this.cydranContext
		};

		context.addBehavior(region);
		region.tell(BehaviorTransitions.INIT, deps);
	}
}

export default RegionVisitor;
