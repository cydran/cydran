import { MutableProperties, Properties } from "properties/Property";
import SimpleMap from "interface/SimpleMap";
import { requireNotNull, isDefined } from "util/Utils";

type PropFlagVals = {key: string, write: boolean, delete: boolean};

class PropertiesImpl implements MutableProperties {

	private parent: Properties;

	private properties: SimpleMap<any>;

	constructor(parent?: Properties) {
		this.parent = parent;
		this.clear();
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

	public keyFamilyPrefixDefined(key: string): boolean {
		requireNotNull(key, "key");
		let isFound: boolean = false;
		Object.keys(this.properties).forEach((k: string) => {
			if(!isFound && k.indexOf(key) === 0) {
				isFound = true;
			}
		});
		return isFound;
	}

	public isTruthy(key: string): boolean {
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);

		return isDefined(value) ? value + "" : null;
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");

		const prop: PropFlagVals = this.getFlags(key);

		Object.defineProperty(this.properties, prop.key, {
			'value': value,
			'enumerable': true,
			'writable': prop.write,
			'configurable': prop.delete
		});

		return this;
	}

	public remove(key: string): MutableProperties {
		requireNotNull(key, "key");

		if (this.properties.hasOwnProperty(key)) {
			delete this.properties[key];
		}

		return this;
	}

	public clear(): MutableProperties {
		this.properties = {};
		return this;
	}

	public load(values: any): MutableProperties {
		requireNotNull(values, "values");

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}
			this.set(key, values[key]);
		}

		return this;
	}

	public extend(): MutableProperties {
		return new PropertiesImpl(this);
	}


	private getFlags(wkKey: string): PropFlagVals {
		requireNotNull(wkKey, "key");
		const idx = wkKey.indexOf("|");
		const pfx: string = wkKey.substring(0, idx);
		const retval: PropFlagVals = {key: wkKey.substring(idx + 1), write: true, delete: false};
		if(pfx.length > 0 && pfx.length < 3) {
			retval.write = ('-' !== pfx.charAt(0));
			retval.delete = ('+' === pfx.charAt(1));
		}
		return retval;
	}
}

export default PropertiesImpl;
