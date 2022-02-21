import { INPUT_KEY, DOM_KEY } from "Constants";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";
import { isDefined } from "util/Utils";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";

abstract class AbstractInputModelBehavior extends AbstractBehavior<string, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asString);
	}

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.onInput);
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onChange);
		this.onChange(null, this.getMediator().get());
	}

	protected abstract onInput(event: Event): void;

	protected abstract onChange(previous: string, current: string): void;

}

class RadioModelBehavior extends AbstractInputModelBehavior {

	public onInput(event: Event): void {
		const value: string = this.getEl().value;

		if (this.getEl().checked) {
			this.$apply(() => {
				this.getMediator().set(value);
			}, []);
		}

		this.notify("modelChanged", value);
	}

	protected onChange(previous: string, current: string): void {
		if (this.getEl().value === current) {
			this.getEl().checked = true;
		}

		this.notify("modelChanged", current);
	}

}

class ValuedModelBehavior extends AbstractInputModelBehavior {

	public onInput(event: Event): void {
		const value: string = this.getEl().value;

		this.$apply(() => {
			this.getMediator().set(value);
		}, []);

		this.notify("modelChanged", value);
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().value = current;
		this.notify("modelChanged", current);
	}

}

type BehaviorFunction = (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>;
const fn: BehaviorFunction = (el: HTMLInputElement) => isDefined(el.type) && el.type.toLowerCase() === "radio" ? RadioModelBehavior : ValuedModelBehavior;

BehaviorsRegistry.register("model", ["textarea"], ValuedModelBehavior);
BehaviorsRegistry.registerFunction("model", ["input"], fn);

export default ValuedModelBehavior;
