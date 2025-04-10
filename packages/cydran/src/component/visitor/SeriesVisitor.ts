import ElementVisitor from "component/visitor/ElementVisitor";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import SeriesElement from "element/SeriesElement";
import SeriesBehavior from "behavior/core/SeriesBehavior";

class SeriesVisitor implements ElementVisitor<SeriesElement, any> {

	public visit(element: SeriesElement, internals: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const series: SeriesBehavior = new SeriesBehavior(internals);

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: element,
			expression: "",
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: internals.getExtractor().asTypePrefix("series"),
			validated: internals.isValidated(),
			mutable: true
		};

		internals.addBehavior(series);
		series.tell(BehaviorTransitions.INIT, dependencies);
	}
}

export default SeriesVisitor;
