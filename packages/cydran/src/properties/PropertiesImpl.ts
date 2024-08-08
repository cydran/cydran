import { MutableProperties, Properties, PropFlagVals } from "properties/Property";
import SimpleMap from "interface/SimpleMap";
import { requireNotNull, isDefined } from "util/Utils";
import { asString } from "util/AsFunctions";

const AttribKey = {
	KEY: "key",
	WRITE: "write",
	DELETE: "delete"
} as const;

class PropertiesImpl implements MutableProperties {

	private parent: Properties;

	private properties: SimpleMap<any>;

	constructor(parent?: Properties) {
		this.parent = parent;
		this.clear();
	}

	public getWithFallback<T>(preferredKey: string, prefix: string): T {
		throw new Error("Method not implemented.");
	}

	public pin(...keys: string[]): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public unpin(...keys: string[]): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public snapshot(): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public keys(): string[] {
		throw new Error("Method not implemented.");
	}

	public mirror(source: Properties): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public includes(key: string): boolean {
		throw new Error("Method not implemented.");
	}

	public lock(...names: string[]): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public unlock(...names: string[]): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public modify<T>(name: string, modifierFn: (value: T) => T): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public isFalsy(key: string): boolean {
		throw new Error("Method not implemented.");
	}

	public isLocked(key: string): boolean {
		return false;
	}

	public isPinned(key: string): boolean {
		throw new Error("Method not implemented.");
	}

	public addObserver(callback: (name: string, value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public removeObserver(callback: (name: string, value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public addFallbackObserver(callback: (key: string, value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public removeFallbackObserver(callback: (key: string, value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public addPropertyObserver(name: string, callback: (value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public removePropertyObserver(name: string, callback: (value: any) => void): void {
		throw new Error("Method not implemented.");
	}

	public get<T>(key: string): T {
		requireNotNull(key, AttribKey.KEY);

		let value: any = null;

		if (this.properties.hasOwnProperty(key)) {
			value = this.properties[key];
		} else if (isDefined(this.parent)) {
			value = this.parent.get(key);
		}

		return value;
	}

	public attributesOf(key: string): PropFlagVals {
		requireNotNull(key, AttribKey.KEY);

		let retval: PropFlagVals = null;

		if (this.properties.hasOwnProperty(key)) {
			const propMeta = Object.getOwnPropertyDescriptor(this.properties, key);
			retval = { [AttribKey.KEY]: key, [AttribKey.WRITE]: propMeta.writable, [AttribKey.DELETE]: propMeta.configurable };
		} else if (isDefined(this.parent)) {
			retval = this.parent.attributesOf(key);
		}

		return retval;
	}

	public isDefined(key: string): boolean {
		return isDefined(this.get(key));
	}

	public familyGroupKeysFrom(partial: string, immuteToo: boolean = false): string[] {
		requireNotNull(partial, "partial");

		let parentKeys: string[] = [];
		if(isDefined(this.parent)) {
			parentKeys = this.parent.familyGroupKeysFrom(partial, immuteToo);
		}
		const hereNowKeys: string[] = Object.getOwnPropertyNames(this.properties).filter(key => {
			const propIsMutable: boolean = Object.getOwnPropertyDescriptor(this.properties, key).writable;
			return key.indexOf(partial) === 0 && (propIsMutable || (!propIsMutable && immuteToo));
		});

		const retval: string[] = parentKeys.concat(hereNowKeys);

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
		return asString(value);
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, AttribKey.KEY);

		const extantPropFlags: PropFlagVals = this.attributesOf(key);

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
		requireNotNull(key, AttribKey.KEY);

		try {
			if (this.properties.hasOwnProperty(key)) {
				delete this.properties[key];
			}
		} catch (err) {
			// INFO: do nothing for now - may be a better way to deal with this
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
		requireNotNull(wkKey, AttribKey.KEY);
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
