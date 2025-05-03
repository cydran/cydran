import SimpleMap from "interface/SimpleMap";
import { Context, Nestable, SeriesOperations, Stage } from "context/Context";
import StageInternals from "stage/StageInternals";
import { defaulted, requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";
import { Ids } from "CydranConstants";

class StageImpl implements Stage {

	private internals: StageInternals;

	constructor(rootSelector: string, properties: SimpleMap<unknown>, callback?: (context: Context) => void, thisObject?: Object) {
		requireNotNull(rootSelector, "rootSelector");
		const context: Context = GlobalContextHolder.getContext().createChild();
		context.registerConstant(Ids.ROOT_SELECTOR, rootSelector);
		context.registerConstant(Ids.STAGE, this);
		this.internals = context.getObject(Ids.STAGE_INTERNALS, defaulted(properties, {}), callback, thisObject);
		requireNotNull(this.internals, "stageInternals");
	}

	public getContext(): Context {
		return this.internals.getContext();
	}

	public start(): Stage {
		this.internals.start();

		return this;
	}

	public setComponent(component: Nestable): Stage {
		this.internals.setComponent(component);

		return this;
	}

	public setComponentByObjectId(componentName: string, defaultComponentName?: string): Stage {
		this.internals.setComponentByObjectId(componentName, defaultComponentName);

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

	public before(): SeriesOperations {
		return this.internals.before();
	}

	public after(): SeriesOperations {
		return this.internals.after();
	}

}

export default StageImpl;
