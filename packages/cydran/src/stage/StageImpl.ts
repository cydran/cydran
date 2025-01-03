import SimpleMap from "interface/SimpleMap";
import { Context, Nestable, Stage } from "context/Context";
import StageInternals from "stage/StageInternals";
import { defaulted, requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";
import { Ids } from "CydranConstants";

class StageImpl implements Stage {

	private internals: StageInternals;

	constructor(rootSelector: string, properties: SimpleMap<any>) {
		requireNotNull(rootSelector, "rootSelector");
		const context: Context = GlobalContextHolder.getContext().createChild();
		context.registerConstant(Ids.ROOT_SELECTOR, rootSelector);
		context.registerConstant(Ids.STAGE, this);
		this.internals = context.getObject(Ids.STAGE_INTERNALS, defaulted(properties, {}));
		requireNotNull(this.internals, "stageInternals");
	}

	public getContext(): Context {
		return this.internals.getContext();
	}

	public addComponentBefore(component: Nestable): Stage {
		// TODO - Replace this method with component lists
		this.internals.addComponentBefore(component);

		return this;
	}

	public addComponentAfter(component: Nestable): Stage {
		// TODO - Replace this method with component lists
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

	public addInitializer(thisObject: Object, callback: (stage: Stage) => void): Stage {
		this.internals.addInitializer(thisObject, callback);

		return this;
	}

	public $release(): void {
		this.internals.$release();
	}

	public isStarted(): boolean {
		return this.internals.isStarted();
	}

}

export default StageImpl;
