import SimpleMap from "@/pattern/SimpleMap";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import { Properties, MutableProperties } from "@/properties/Interfaces";

class PropertiesImpl implements Properties {

	private parent: Properties;

	private properties: SimpleMap<any>;

	constructor(parent?: Properties) {
		this.properties = {};
		this.parent = parent;
	}

	public get<T>(key: string): T {
		requireNotNull(key, "key");

		let value: any = null;

		if (this.properties.hasOwnProperty(key)) {
			value = this.properties[key];
		} else if (isDefined(this.parent)) {
			value = this.parent.get(key);
		}

		return value;
	}

	public isDefined(key: string): boolean {
		return isDefined(this.get(key));
	}

	public isTruthy(key: string): boolean {
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);

		return isDefined(value) ? value + '' : null;
	}

	public set(key: string, value: any): Properties {
		requireNotNull(key, "key");

		this.properties[key] = value;

		return this;
	}

	public remove(key: string): Properties {
		requireNotNull(key, "key");

		if (this.properties.hasOwnProperty(key)) {
			delete this.properties[key];
		}

		return this;
	}

	public load(values: any): Properties {
		requireNotNull(values, "values");

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}

			this.properties[key] = values[key];
		}

		return this;
	}

	public extend(): MutableProperties {
		return new PropertiesImpl(this);
	}

}

export default PropertiesImpl;
