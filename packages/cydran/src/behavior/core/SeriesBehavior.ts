import Tellable from "interface/ables/Tellable";
import ElementReference from "component/ElementReference";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import AbstractContainerBehavior from "behavior/AbstractContainerBehavior";
import DigestableSource from "behavior/DigestableSource";
import { Nestable } from "context/Context";
import Series from "component/Series";
import { isDefined, requireNotNull, defaultAsNull, removeFromArray } from 'util/Utils';
import DomUtils from "dom/DomUtils";
import SeriesAttributes from "behavior/core/series/SeriesAttributes";
import { validateValidSeriesName } from "validator/Validations";
import { DuplicateComponentError } from "error/Errors";
import ComponentTransitions from "component/ComponentTransitions";

const TOP_COMMENT_TEXT: string = "SS";
const BOTTOM_COMMENT_TEXT: string = "SE";

const DEFAULT_ATTRIBUTES: SeriesAttributes = {
	name: null
};

class SeriesBehavior extends AbstractContainerBehavior<any, HTMLElement, SeriesAttributes> implements Series, Tellable {

	private components: Nestable[];

	private parent: ComponentInternals;

	private name: string;

	private topComment: Comment;

	private bottomComment: Comment;

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

	public getAt<N extends Nestable>(index: number): N {
		return this.indexWithinBounds(index) ? this.components[index]  as N : null;
	}

	public replace(oldComponent: Nestable, newComponent: Nestable): void {
		this.guardDuplicate(newComponent);
		const index: number = this.components.indexOf(oldComponent);

		if (index > -1) {
			this.replaceAt(index, newComponent);
		}
	}

	public replaceAt(index: number, component: Nestable): void {
		this.guardDuplicate(component);

		if (this.indexWithinBounds(index)) {
			const existingComponent: Nestable = this.getAt(index);
			const el: HTMLElement = existingComponent.$c().getEl();
			this.topComment.parentElement.replaceChild(component.$c().getEl(), el);
			this.components[index] = component;
			this.unintegrateComponent(existingComponent);
			this.integrateComponent(component);
		} else {
			this.insertLast(component);
		}
	}

	public remove(component: Nestable): void {
		const index: number = this.components.indexOf(component);

		if (index > -1) {
			this.removeAt(index);
		}
	}

	public removeAt(index: number): void {
		const component: Nestable = this.getAt(index);

		if (isDefined(component)) {
			const el: HTMLElement = component.$c().getEl();
			this.topComment.parentElement.removeChild(el);
			this.components.splice(index, 1);
			this.unintegrateComponent(component);
		}
	}

	public insertBefore(index: number, component: Nestable): void {
		this.guardDuplicate(component);
		const existingComponent: Nestable = this.getAt(index);

		if (isDefined(existingComponent)) {
			const existingEl: HTMLElement = existingComponent.$c().getEl();
			const newEl: HTMLElement = component.$c().getEl();
			this.topComment.parentElement.insertBefore(newEl, existingEl);
			this.components.splice(index, 0, component);
			this.integrateComponent(component);
		} else {
			this.insertLast(component);
		}
	}

	public insertAfter(index: number, component: Nestable): void {
		this.guardDuplicate(component);
		const existingComponent: Nestable = this.getAt(index);

		if (isDefined(existingComponent)) {
			const existingEl: HTMLElement = existingComponent.$c().getEl();
			const newEl: HTMLElement = component.$c().getEl();
			this.topComment.parentElement.insertBefore(newEl, existingEl.nextSibling);
			this.components.splice(index + 1, 0, component);
			this.integrateComponent(component);
		}
	}

	public insertFirst(component: Nestable): void {
		this.guardDuplicate(component);

		if (this.components.length > 0) {
			this.insertBefore(0, component);
		} else {
			const newEl: HTMLElement = component.$c().getEl();
			this.topComment.parentElement.insertBefore(newEl, this.bottomComment);
			this.components.push(component);
			this.integrateComponent(component);
		}
	}

	public insertLast(component: Nestable): void {
		this.guardDuplicate(component);
		const newEl: HTMLElement = component.$c().getEl();
		this.topComment.parentElement.insertBefore(newEl, this.bottomComment);
		this.components.push(component);
		this.integrateComponent(component);
	}

	public contains(component: Nestable): boolean {
		return this.components.indexOf(component) > -1;
	}

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
		this.bottomComment = DomUtils.createComment(BOTTOM_COMMENT_TEXT);
		this.topComment = DomUtils.createComment(TOP_COMMENT_TEXT);
		this.dependencies.el.parentElement.replaceChild(this.bottomComment, this.dependencies.el);
		this.bottomComment.parentElement.insertBefore(this.topComment, this.bottomComment);
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

	private guardDuplicate(component: Nestable): void {
		if (this.contains(component)) {
			throw new DuplicateComponentError("Component already exists in series");
		}	
	}

	private indexWithinBounds(index: number): boolean {
		return index >= 0 && index < this.components.length;
	}

	private integrateComponent(component: Nestable): void {
		if (isDefined(component)) {
			this.getLogger().ifTrace(() => `Setting component ${component.$c().getId()}`);
			component.$c().tell("setParentContext", this.getContext());
			component.$c().tell(ComponentTransitions.INIT, null);
		}

		component.$c().tell("setParent", this.parent.getComponent());
	}

	private unintegrateComponent(component: Nestable): void {
		component.$c().tell("setParent", null);
	}

}

export default SeriesBehavior;
