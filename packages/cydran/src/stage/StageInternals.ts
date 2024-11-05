import { Context, Stage } from "context/Context";
import Releasable from "interface/ables/Releasable";
import { Nestable } from "interface/ComponentInterfaces";

interface StageInternals extends Releasable {

	addComponentBefore(component: Nestable): void;

	addComponentAfter(component: Nestable): void;

	getContext(): Context;

	start(): void;

	setComponent(component: Nestable): void;

	setComponentFromRegistry(componentName: string, defaultComponentName?: string): void;

	addInitializer(thisObject: any, callback: (stage: Stage) => void): void;

	isStarted(): boolean;

}

export default StageInternals;
