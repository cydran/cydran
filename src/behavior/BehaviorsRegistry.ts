import Behavior from "behavior/Behavior";
import Type from "interface/Type";

type BehaviorFunction = (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>;

interface BehaviorsRegistry {

	register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerFunction(name: string, supportedTags: string[], behavionFunction: BehaviorFunction): void;

	lookup(el: HTMLElement, type: string, tag: string): Type<Behavior<any, HTMLElement, any>>;

}

export default BehaviorsRegistry;
