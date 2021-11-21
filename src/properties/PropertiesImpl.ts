import { MutableProperties, Properties, PropFlagVals } from "properties/Property";
import SimpleMap from "interface/SimpleMap";
import { requireNotNull, isDefined } from "util/Utils";

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

	public existingPropertyAttributes(key: string): PropFlagVals {
		requireNotNull(key, "key");

		let retval: PropFlagVals = null;

		if (this.properties.hasOwnProperty(key)) {
			const descripts = Object.getOwnPropertyDescriptor(this.properties, key);
			retval = { 'key': key, 'write': descripts.writable, 'delete': descripts.configurable };
		} else if (isDefined(this.parent)) {
			retval = this.parent.existingPropertyAttributes(key);
		}

		return retval;
	}

	public isDefined(key: string): boolean {
		return isDefined(this.get(key));
	}

	public keyFamilyPropertyNames(pkey: string, immuteToo: boolean = false): String[] {
		requireNotNull(pkey, "pkey");

		let parentKeys: String[] = [];
		if(isDefined(this.parent)) {
			parentKeys = this.parent.keyFamilyPropertyNames(pkey, immuteToo);
		}
		const hereNowKeys: String[] = Object.getOwnPropertyNames(this.properties).filter(key => {
			const propIsMutable: boolean = Object.getOwnPropertyDescriptor(this.properties, key).writable;
			return key.indexOf(pkey) === 0 && (propIsMutable || (!propIsMutable && immuteToo));
		});

		const retval: String[] = parentKeys.concat(hereNowKeys);

		// INFO: newer way| const retval: String[] = Array.from(new Set(parentKeys.concat(hereNowKeys)));

		return retval.filter((item, index) => {
			return retval.indexOf(item) === index;
		});
	}

	public isTruthy(key: string): boolean {
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);

		return isDefined(value) ? (typeof value === "string" ? value : JSON.stringify(value)) : null;
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");

		const extantPropFlags: PropFlagVals = this.existingPropertyAttributes(key);

		if(!isDefined(extantPropFlags) || extantPropFlags.write) {
			const newPropFlags: PropFlagVals = this.parseKeyForFlags(key);
			try {
				Object.defineProperty(this.properties, newPropFlags.key, {
					enumerable: true,
					value: value,
					writable: newPropFlags.write,
					configurable: newPropFlags.delete
				});
			} catch (ex) {
				// nothing to do for now, but flags are enforced
			}
		}

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

	private parseKeyForFlags(wkKey: string): PropFlagVals {
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
