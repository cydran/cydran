import Tellable from "interface/ables/Tellable";
import ElementReference from "component/ElementReference";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import DigestableSource from "behavior/DigestableSource";
import { Nestable } from "context/Context";
import Series from "component/Series";
import { isDefined, requireNotNull } from "util/Utils";
import DomUtils from "dom/DomUtils";
import SeriesAttributes from "behavior/core/series/SeriesAttributes";
import { validateValidSeriesName } from "validator/Validations";

// TODO - Update this to actually implement the Series interface correctly

const COMMENT_TEXT: string = "Series";

const DEFAULT_ATTRIBUTES: SeriesAttributes = {
	name: null
};

class SeriesBehavior extends AbstractContainerBehavior<any, HTMLElement, SeriesAttributes> implements Series, Tellable {

	private components: Nestable[];

	private parent: ComponentInternals;

	private name: string;

	private element: Comment;

	private elements: ElementReference<HTMLElement>[];

	public dependencies: BehaviorDependencies;

	constructor(parent: ComponentInternals) {
		super();
		this.components = [];
		this.elements = [];
		this.parent = parent;
		this.setDefaults(DEFAULT_ATTRIBUTES);
		this.setValidations({
			name: [validateValidSeriesName]
		});
		this.setConverters({});
		this.setDefaultExpression("");
		this.setPrefixed(false);
	}

	public isEmpty(): boolean {
		return this.components.length === 0;
	}

	public clear(): void {
		while (this.hasComponents()) {
			this.removeAt(0);
		}
	}

	// -----------------------------------------------------------------------

	public getAt<N extends Nestable>(index: number): N {
		return this.components[index] as N;
	}

	public replaceAt(index: number, component: Nestable): void {
		throw new Error("Method not implemented.");
	}

	public remove(component: Nestable): void {
		throw new Error("Method not implemented.");
	}

	public removeAt(index: number): void {
		// TODO - This is not correct; implememnt properly
		const component: Nestable = this.getAt(index);

		if (isDefined(component)) {
			const el: HTMLElement = component.$c().getEl();

			this.components.splice(index, 1);
		}
	}

	public addAt(index: number, component: Nestable): void {
		throw new Error("Method not implemented.");
	}

	public addAsFirst(component: Nestable): void {
		throw new Error("Method not implemented.");
	}

	public addAsLast(component: Nestable): void {
		throw new Error("Method not implemented.");
	}

	// -----------------------------------------------------------------------

	public tellComponents(name: string, payload: any): void {
		for (const component of this.components) {
			component.$c().tell(name, payload);
		}
	}

	public messageComponents(channelName: string, messageName: string, payload: any): void {
		for (const component of this.components) {
			component.$c().send(messageName, payload).onChannel(channelName).toSelf();
		}
	}

	public hasComponents(): boolean {
		return this.components.length > 0;
	}

	public onInit(dependencies: BehaviorDependencies): void {
		this.dependencies = dependencies;
		this.element = DomUtils.createComment(COMMENT_TEXT);
		this.dependencies.el.parentElement.replaceChild(this.element, this.dependencies.el);
		this.name = requireNotNull(this.getParams().name, "name");
		this.setLoggerName(`Series ${this.name} for ${dependencies.parent.getId()}`);
		this.dependencies.parent.addSeries(this.name, this);
	}

	public onMount(): void {
		// Intentionally do nothing
	}

	public requestDigestionSources(sources: DigestableSource[]): void {
		// Intentionally do nothing
	}

	public $release() {
		this.clear();
	}

}

export default SeriesBehavior;
