import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";

class LegacyRegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, internals: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const region: RegionBehavior = new RegionBehavior(internals);

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: element,
			expression: "",
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: internals.getExtractor().asTypePrefix("region"),
			validated: internals.isValidated(),
			mutable: true
		};

		internals.addBehavior(region);
		region.tell(BehaviorTransitions.INIT, dependencies);
	}
}

export default LegacyRegionVisitor;
