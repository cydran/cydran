import { Context, Stage } from "context/Context";
import { Nestable } from "interface/ComponentInterfaces";
import Disposable from "interface/ables/Disposable";

interface StageInternals extends Disposable {

	addComponentBefore(component: Nestable): void;

	addComponentAfter(component: Nestable): void;

	getContext(): Context;

	start(): void;

	setComponent(component: Nestable): void;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	addInitializer(callback: (stage: Stage) => void): void;

	isStarted(): boolean;

}

export default StageInternals;
