import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import { requireNotNull } from "util/Utils";
import Services from "service/Services";

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	private services: Services;

	constructor(services: Services) {
		this.services = requireNotNull(services, "services");
	}

	public visit(element: HTMLScriptElement, internals: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const region: RegionBehavior = new RegionBehavior(internals);

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: element,
			expression: "",
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: internals.getExtractor().asTypePrefix("region"),
			context: internals.getContext(),
			validated: internals.isValidated(),
			mutable: true,
			services: this.services
		};

		internals.addBehavior(region);
		region.tell(BehaviorTransitions.INIT, dependencies);
	}
}

export default RegionVisitor;
