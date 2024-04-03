import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import RegionElement from 'element/RegionElement';

class RegionVisitor implements ElementVisitor<RegionElement, any> {

	public visit(element: RegionElement, internals: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
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

export default RegionVisitor;
