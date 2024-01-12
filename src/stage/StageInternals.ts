import Behavior from "behavior/Behavior";
import Context from "context/Context";
import { Nestable } from "interface/ComponentInterfaces";
import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";
import Stage from 'stage/Stage';

interface StageInternals extends Disposable {

	addComponentBefore(component: Nestable): void;

	addComponentAfter(component: Nestable): void;

	getContext(): Context;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	start(stage: Stage): void;

	setComponent(component: Nestable): void;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	isStarted(): boolean;

}

export default StageInternals;
