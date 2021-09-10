import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const region: RegionBehavior = new RegionBehavior(context, element);

		const deps: BehaviorDependencies = {
			parent: context,
			el: element,
			expression: "",
			model: context.getModel(),
			prefix: context.getExtractor().getPrefix(),
			behaviorPrefix: context.getExtractor().asTypePrefix("region"),
			module: context.getModule(),
			validated: context.isValidated(),
			mutable: true
		};

		context.addBehavior(region);
		region.tell(BehaviorTransitions.INIT, deps);
	}
}

export default RegionVisitor;
