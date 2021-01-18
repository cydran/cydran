import { Stage, StageBuilder } from "stage/Stage";
import CydranConfig from "config/CydranConfig";
import Type from "interface/Type";
import Module from "module/Module";
import ElementMediator from "mediator/ElementMediator";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { requireNotNull, merge } from "util/Utils";
import StageImpl from "stage/StageImpl";

class StageBuilderImpl implements StageBuilder {
	private config: CydranConfig;

	private instance: StageImpl;

	constructor(rootSelector: string) {
		this.config = new CydranConfig();
		this.instance = new StageImpl(rootSelector);
	}

	public withComponentBefore(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentBefore(id, moduleName);
		return this;
	}

	public withComponentAfter(id: string, moduleName?: string): StageBuilder {
		this.instance.withComponentAfter(id, moduleName);
		return this;
	}

	public withComponent(id: string, moduleName?: string): StageBuilder {
		return this.withComponentAfter(id, moduleName);
	}

	public withInitializer(callback: (stage?: Stage) => void): StageBuilder {
		this.instance.withInitializer(callback);
		return this;
	}

	public withDisposer(callback: (stage?: Stage) => void): StageBuilder {
		this.instance.withDisposer(callback);
		return this;
	}

	public withTraceLogging(): StageBuilder {
		this.config.useTrace();
		return this;
	}

	public withDebugLogging(): StageBuilder {
		this.config.useDebug();
		return this;
	}

	public withInfoLogging(): StageBuilder {
		this.config.useInfo();
		return this;
	}

	public withWarnLogging(): StageBuilder {
		this.config.useWarn();
		return this;
	}

	public withErrorLogging(): StageBuilder {
		this.config.useError();
		return this;
	}

	public withFatalLogging(): StageBuilder {
		this.config.useFatal();
		return this;
	}

	public withLoggingDisabled(): StageBuilder {
		this.config.useDisabled();
		return this;
	}

	public getModule(name: string): Module {
		return this.instance.getModules().getModule(name);
	}

	public getDefaultModule(): Module {
		return this.instance.getModules().getDefaultModule();
	}

	public forEach(fn: (instace: Module) => void): StageBuilder {
		this.instance.getModules().forEach(fn);
		return this;
	}

	public withElementMediator(
		name: string,
		supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>
	): StageBuilder {
		this.instance
			.getModules()
			.registerElementMediator(name, supportedTags, elementMediatorClass);
		return this;
	}

	public withConstant(id: string, instance: any): StageBuilder {
		this.instance.getModules().registerConstant(id, instance);
		return this;
	}

	public withPrototype(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): StageBuilder {
		this.instance.getModules().registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public withPrototypeFromFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): StageBuilder {
		this.instance.getModules().registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withSingleton(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): StageBuilder {
		this.instance.getModules().registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public withSingletonFromFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): StageBuilder {
		this.instance.getModules().registerSingletonWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public withImplicit(
		id: string,
		template: string,
		options?: ComponentOptions
	): StageBuilder {
		this.withPrototypeFromFactory(
			id,
			() => new Component(template, merge([options, { module: this.getDefaultModule() }]))
		);
		return this;
	}

	public withCapability(capability: (builder: StageBuilder) => void): StageBuilder {
		requireNotNull(capability, "capability")(this);
		return this;
	}

	public withScopeItem(name: string, item: any): StageBuilder {
		this.instance.getModules().getScope().add(name, item);
		return this;
	}

	public withProperties(properties: any): StageBuilder {
		this.instance.getProperties().load(properties);

		return this;
	}

	public build(): Stage {
		return this.instance;
	}
}

export default StageBuilderImpl;
