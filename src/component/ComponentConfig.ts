import Module from "@/module/Module";
import { requireNotNull } from "@/util/ObjectUtils";

interface ComponentConfig {

	getMetadata(key: string): any;

	getPrefix(): string;

}

class ComponentConfigImpl implements ComponentConfig {

	private metadata: any;

	private prefix: string;

	private parentModelFn: () => any;

	private module: Module;

	constructor() {
		this.metadata = {};
		this.prefix = "c";
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

export { ComponentConfig, ComponentConfigImpl, ComponentConfigBuilder };
