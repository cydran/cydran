import { Nestable } from "interface/ComponentInterfaces";
import SimpleMap from "interface/SimpleMap";
import { Context, Stage } from "context/Context";
import Behavior from "behavior/Behavior";
import Type from "interface/Type";
import StageInternals from "stage/StageInternals";
import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

class StageImpl implements Stage {

	private internals: StageInternals;

	constructor(rootSelector: string, properties: SimpleMap<any> = {}) {
		requireNotNull(rootSelector, "rootSelector");
		const context: Context = GlobalContextHolder.getContext().createChild();
		this.internals = context.getObject("cydran:stageInternals", this, rootSelector, properties);
		requireNotNull(this.internals, "stageInternals");
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.internals.registerBehavior(name, supportedTags, behaviorClass);
	}

	public registerBehaviorFunction(name: string,
									supportedTags: string[],
									behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.internals.registerBehaviorFunction(name, supportedTags, behaviorFunction);
	}

	public getContext(): Context {
		return this.internals.getContext();
	}

	public addComponentBefore(component: Nestable): Stage {
		this.internals.addComponentBefore(component);

		return this;
	}

	public addComponentAfter(component: Nestable): Stage {
		this.internals.addComponentAfter(component);

		return this;
	}

	public start(): Stage {
		this.internals.start();

		return this;
	}

	public setComponent(component: Nestable): Stage {
		this.internals.setComponent(component);

		return this;
	}

	public setComponentFromRegistry(componentName: string, defaultComponentName?: string): Stage {
		this.internals.setComponentFromRegistry(componentName, defaultComponentName);

		return this;
	}

	public addInitializer(callback: (stage: Stage) => void): Stage {
		this.internals.addInitializer(callback);

		return this;
	}

	public $dispose(): void {
		this.internals.$dispose();
	}

	public isStarted(): boolean {
		return this.internals.isStarted();
	}

}

export default StageImpl;
