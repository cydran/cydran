import Behavior from "behavior/Behavior";
import { Context, Stage } from "context/Context";
import { Nestable } from "interface/ComponentInterfaces";
import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";

interface StageInternals extends Disposable {

	addComponentBefore(component: Nestable): void;

	addComponentAfter(component: Nestable): void;

	getContext(): Context;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	start(): void;

	setComponent(component: Nestable): void;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	addInitializer(callback: (stage: Stage) => void): void;

	isStarted(): boolean;

}

export default StageInternals;
