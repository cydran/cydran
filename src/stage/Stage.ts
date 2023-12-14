import Behavior from "behavior/Behavior";
import Context from "context/Context";
import { Nestable } from "interface/ComponentInterfaces";
import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";

interface Stage extends Disposable {

	addComponentBefore(component: Nestable): Stage;

	addComponentAfter(component: Nestable): Stage;

	setComponent(component: Nestable): Stage;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	start(): Stage;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	isStarted(): boolean;

	getContext(): Context;

}

export default Stage;
