import ObjectUtils from "@/ObjectUtils";

const requireNotNull = ObjectUtils.requireNotNull;

interface ComponentIdPair {

	componentId: string;

	moduleId: string;

}

interface ComponentConfig {

	getMetadata(key: string): any;

	getPrefix(): string;

	getAttributes(): string[];

}

class ComponentConfigImpl implements ComponentConfig {

	private metadata: any;

	private attributes: string[];

	private prefix: string;

	private topComponentIds: ComponentIdPair[];

	private bottomComponentIds: ComponentIdPair[];

	constructor() {
		this.metadata = {};
		this.attributes = [];
		this.prefix = "c";
		this.topComponentIds = [];
		this.bottomComponentIds = [];
	}

	public getMetadata(key: string): any {
		return this.metadata[key] ? this.metadata[key] : null;
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public getAttributes(): string[] {
		return this.attributes.slice();
	}

	public withMetadata(name: string, value: any): void {
		this.metadata[name] = value;
	}

	public withAttribute(name: string): void {
		this.attributes.push(name);
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

	public withAttribute(name: string): ComponentConfigBuilder {
		requireNotNull(name, "name");
		this.instance.withAttribute(name);

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
