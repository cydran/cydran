import Module from "@/module/Module";
import { requireNotNull } from "@/util/ObjectUtils";

interface ComponentIdPair {

	componentId: string;

	moduleId: string;

}

interface ComponentConfig {

	getMetadata(key: string): any;

	getPrefix(): string;

}

class ComponentConfigImpl implements ComponentConfig {

	private metadata: any;

	private prefix: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	private parentModelFn: () => any;

	private module: Module;

	constructor() {
		this.metadata = {};
		this.prefix = "c";
		this.topComponentIds = [];
		this.bottomComponentIds = [];
		this.parentModelFn = null;
	}

	public getMetadata(key: string): any {
		return this.metadata[key] ? this.metadata[key] : null;
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public withMetadata(name: string, value: any): void {
		this.metadata[name] = value;
	}

	public withPrefix(prefix: string): void {
		this.prefix = prefix;
	}

	public setTopComponentIds(topComponentIds: ComponentIdPair[]): void {
		this.topComponentIds = topComponentIds;
	}

	public setBottomComponentIds(bottomComponentIds: ComponentIdPair[]): void {
		this.bottomComponentIds = bottomComponentIds;
	}

	public getTopComponentIds(): ComponentIdPair[] {
		return this.topComponentIds;
	}

	public getBottomComponentIds(): ComponentIdPair[] {
		return this.bottomComponentIds;
	}

	public setModule(module: Module): void {
		this.module = module;
	}

	public getModule(): Module {
		return this.module;
	}

	public setParentModelFn(parentModelFn: () => any): void {
		this.parentModelFn = parentModelFn;
	}

	public getParentModelFn(): () => any {
		return this.parentModelFn;
	}

}

class ComponentConfigBuilder {

	private instance: ComponentConfigImpl;

	constructor() {
		this.instance = new ComponentConfigImpl();
	}

	public withMetadata(name: string, value: any): ComponentConfigBuilder {
		requireNotNull(name, "name");
		requireNotNull(value, "value");
		this.instance.withMetadata(name, value);

		return this;
	}

	public withPrefix(prefix: string): ComponentConfigBuilder {
		requireNotNull(prefix, "prefix");
		this.instance.withPrefix(prefix);

		return this;
	}

	public build(): ComponentConfig {
		return this.instance;
	}

}

export { ComponentConfig, ComponentConfigImpl, ComponentConfigBuilder, ComponentIdPair };
