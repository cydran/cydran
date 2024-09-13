import { MutableProperties, PropFlagVals, Properties } from "properties/Property";
import AdvancedMap from 'pattern/AdvancedMap';
import { requireNotNull, isDefined, equals, startsWith, requireValid } from 'util/Utils';
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { asString } from 'util/AsFunctions';
import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";
import { PrefixMismatchError, UnknownPropertyError } from "error/Errors";
import StringSet from "pattern/StringSet";
import StringSetImpl from "pattern/StringSetImpl";
import PropertyGeneralizationPredicate from "properties/PropertyGeneralizationPredicate";
import PropertyGeneralizationMapper from "properties/PropertyGeneralizationMapper";
import { PROPERTY_KEY } from "Constants";

abstract class AbstractPropertiesImpl implements MutableProperties {

	private locks: StringSet;

	private pins: StringSet;

	private observers: Observable;

	private propertyObservers: AdvancedMap<Observable>;

	constructor() {
		this.locks = new StringSetImpl();
		this.pins = new StringSetImpl();
		this.observers = new ObservableImpl();
		this.propertyObservers = new AdvancedMapImpl<Observable>();
	}

	public getWithFallback<T>(preferredKey: string, prefix: string): T {
		requireValid(preferredKey, "preferredKey", PROPERTY_KEY);

		return isDefined(prefix)
			? this.getWithFallbackWithPrefix(preferredKey, prefix)
			: this.getWithFallbackWithoutPrefix(preferredKey);
	}

	private getWithFallbackWithPrefix<T>(preferredKey: string, prefix: string): T {
		if (!startsWith(preferredKey, prefix + ".")) {
			throw new PrefixMismatchError("preferredKey must start with the prefix");
		}

		const prefixWithSeparator: string = prefix + ".";
		const trimmedKey: string = preferredKey.substring((prefix + ".").length);
		const keySegments: string[] = trimmedKey.split(".");

		if (keySegments.length == 1) {
			return this.get(prefixWithSeparator + preferredKey);
		}

		const baseKey: string = keySegments.pop();

		let result: any = undefined;

		while (keySegments.length > 0) {
			const key: string = keySegments.join(".");
			const currentKey: string = key + "." + baseKey;

			if (this.includes(prefixWithSeparator + currentKey)) {
				result = this.get(prefixWithSeparator + currentKey);
				break;
			}

			keySegments.pop();
		}

		if (result === undefined && this.includes(prefixWithSeparator + baseKey)) {
			result = this.get(prefixWithSeparator + baseKey);
		}

		return result;
	}

	private getWithFallbackWithoutPrefix<T>(preferredKey: string): T {
		const keySegments: string[] = preferredKey.split(".");

		if (keySegments.length == 1) {
			return this.get(preferredKey);
		}

		const baseKey: string = keySegments.pop();

		let result: any = undefined;

		while (keySegments.length > 0) {
			const key: string = keySegments.join(".");
			const currentKey: string = key + "." + baseKey;

			if (this.includes(currentKey)) {
				result = this.get(currentKey);
				break;
			}

			keySegments.pop();
		}

		if (result === undefined && this.includes(baseKey)) {
			result = this.get(baseKey);
		}

		return result;
	}

	public pin(...keys: string[]): MutableProperties {
		// TODO - Check all keys as valid

		if (isDefined(keys)) {
			for (const key of keys) {
				this.pins.add(key);
				this.notify(key, this.get(key));
			}
		}

		return this;
	}

	public unpin(...keys: string[]): MutableProperties {
		// TODO - Check all keys as valid

		if (isDefined(keys)) {
			for (const key of keys) {
				this.pins.remove(key);
				this.notify(key, this.get(key));
			}
		}

		return this;
	}

	public snapshot(): MutableProperties {
		const snapshot: MutableProperties = new PropertiesImpl();
		const keys: string[] = this.keys();

		for (const key of keys) {
			const value: any = this.get(key);
			snapshot.set(key, value);
		}

		return snapshot;
	}

	public abstract keys(): string[];

	public mirror(source: Properties): MutableProperties {
		requireNotNull(source, "source");
		// TODO - Evaluate potentially directly passing the this.set method to the source.addObserver method
		source.addObserver(this, (key: string, value: any) => this.set(key, value));

		return this;
	}

	public abstract includes(key: string): boolean;

	public lock(...keys: string[]): MutableProperties {
		// TODO - Check all keys as valid

		if (isDefined(keys)) {
			for (const key of keys) {
				this.locks.add(key);
				this.notify(key, this.get(key));
			}
		}

		return this;
	}

	public unlock(...keys: string[]): MutableProperties {
		// TODO - Check all keys as valid

		if (isDefined(keys)) {
			for (const key of keys) {
				this.locks.remove(key);
				this.notify(key, this.get(key));
			}
		}

		return this;
	}

	public modify<T>(key: string, modifierFn: (value: T) => T): MutableProperties {
		requireValid(key, "key", PROPERTY_KEY);
		requireNotNull(modifierFn, "modifierFn");

		if (!this.includes(key)) {
			throw new UnknownPropertyError("Unknown property: " + key);
		}

		const previousValue: any = this.get(key);
		const newValue: any = modifierFn(previousValue);

		this.set(key, newValue);

		return this;
	}

	public isFalsy(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);

		return !this.isTruthy(key);
	}

	public isLocked(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);

		return this.locks.contains(key);
	}

	public isPinned(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);

		return this.pins.contains(key);
	}

	private addGlobalObserver(thisObject: any, callback: (key: string, value: any) => void, preferredKey: string, prefix: string): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");

		let predicate: (key: string, value: string) => boolean = null;
		let mapper: (key: string, value: any) => any = null;
		const fallbackMapper: (key: string) => any = (key: string) => this.getWithFallback(key, prefix);

		if (isDefined(preferredKey)) {
			const existsPredicate: (key: string) => boolean = (key: string) => this.includes(key);
			predicate = new PropertyGeneralizationPredicate(preferredKey, prefix, existsPredicate).getPredicate();
			mapper = new PropertyGeneralizationMapper(preferredKey, prefix, fallbackMapper).getMapper();
		}

		this.observers.register(thisObject, callback, predicate, mapper);
	}

	private removeGlobalObserver(callback: (key: string, value: any) => void): void {
		requireNotNull(callback, "callback");

		this.observers.unregister(callback);
	}

	public addObserver(thisObject: any, callback: (key: string, value: any) => void): void {
		this.addGlobalObserver(thisObject, callback, null, null);
	}

	public removeObserver(callback: (key: string, value: any) => void): void {
		this.removeGlobalObserver(callback);
	}

	public addFallbackObserver(thisObject: any, callback: (key: string, value: any) => void, preferredKey: string, prefix?: string): void {
		this.addGlobalObserver(thisObject, callback, preferredKey, prefix);
	}

	public removeFallbackObserver(callback: (key: string, value: any) => void): void {
		this.removeGlobalObserver(callback);
	}

	public addPropertyObserver(key: string, thisObject: any, callback: (value: any) => void): void {
		requireValid(key, "key", PROPERTY_KEY);
		requireNotNull(callback, "callback");

		this.propertyObservers.computeIfAbsent(key, () => new ObservableImpl()).register(thisObject, callback);
	}

	public removePropertyObserver(key: string, callback: (value: any) => void): void {
		requireValid(key, "key", PROPERTY_KEY);
		requireNotNull(callback, "callback");

		this.propertyObservers.computeIfAbsent(key, () => new ObservableImpl()).unregister(callback);
	}

	public abstract set(key: string, value: any): MutableProperties;

	public load(values: any): MutableProperties {
		// TODO - Account for meta data fields

		requireNotNull(values, "values");

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}

			if (key === "$locked" || key === "$pinned") {
				continue;
			}

			this.set(key, values[key]);
		}

		return this;
	}

	public abstract remove(key: string): MutableProperties;

	public abstract clear(): MutableProperties;

	public abstract get<T>(key: string): T;

	public extend(): MutableProperties {
		const child: ChildPropertiesImpl = new ChildPropertiesImpl(this);

		return child;
	}

	public isDefined(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);
		return isDefined(this.get(key));
	}

	public isTruthy(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);
		return asString(value);
	}

	protected notify(key: string, value: any): void {
		requireValid(key, "key", PROPERTY_KEY);

		if (this.propertyObservers.has(key)) {
			this.propertyObservers.get(key).notify(value);
		}

		this.observers.notify(key, value);
	}

	protected abstract sync(): void;

	// TODO - Determine if the below methods still apply to the current situation

	public attributesOf(key: string): PropFlagVals {
		throw new Error("Method not implemented.");
	}

	public familyGroupKeysFrom(key: string, immuteToo: boolean): string[] {
		throw new Error("Method not implemented.");
	}

}

class PropertiesImpl extends AbstractPropertiesImpl {

	private values: AdvancedMap<any>;

	constructor() {
		super();
		this.values = new AdvancedMapImpl<any>();
	}

	public clear(): MutableProperties {
		this.values.clear();
		this.sync();

		return this;
	}

	public keys(): string[] {
		return this.values.keys();
	}

	public get<T>(key: string): T {
		return this.values.get(key);
	}

	public remove(key: string): MutableProperties {
		requireValid(key, "key", PROPERTY_KEY);

		this.values.remove(key);
		this.notify(key, undefined);

		return this;
	}

	public set(key: string, value: any): MutableProperties {
		requireValid(key, "key", PROPERTY_KEY);
		const currentValue: any = this.values.get(key);

		if (!this.includes(key) || !equals(1000, currentValue, value)) {
			this.values.put(key, value);
			this.sync();
			this.notify(key, value);
		}

		return this;
	}

	public includes(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);

		return this.values.has(key);
	}

	protected sync(): void {
		// Intentionally do nothing
	}

}

class ChildPropertiesImpl extends AbstractPropertiesImpl {

	private parent: AbstractPropertiesImpl;

	private effectiveValues: AdvancedMap<any>;

	private localValues: AdvancedMap<any>;

	constructor(parent: AbstractPropertiesImpl) {
		super();
		this.parent = requireNotNull(parent, "parent");
		this.localValues = new AdvancedMapImpl<any>();
		this.effectiveValues = new AdvancedMapImpl<any>();
		// TODO - Evaluate potentially directly passing the this.reevaluateProperty method to the parent.addObserver method
		this.parent.addObserver({}, (key: string) => this.reevaluateProperty(key));
		this.sync();
	}

	public clear(): MutableProperties {
		this.localValues.clear();
		this.sync();

		return this;
	}

	public keys(): string[] {
		return this.effectiveValues.keys();
	}

	public get<T>(key: string): T {
		return this.effectiveValues.get(key);
	}

	public set(key: string, value: any): MutableProperties {
		requireValid(key, "key", PROPERTY_KEY);
		this.localValues.put(key, value);
		this.reevaluateProperty(key);
		this.sync();

		this.notify(key, value);

		return this;
	}

	public includes(key: string): boolean {
		requireValid(key, "key", PROPERTY_KEY);

		return this.effectiveValues.has(key);
	}

	public remove(key: string): MutableProperties {
		requireValid(key, "key", PROPERTY_KEY);

		this.localValues.remove(key);
		this.sync();

		return this;
	}

	protected sync(): void {
		const keys: string[] = this.parent.keys();

		for (const key of keys) {
			this.reevaluateProperty(key);
		}
	}

	private reevaluateProperty(key: string): void {
		const parentValue: any = this.parent.get(key);
		const localValue: any = this.localValues.get(key);
		const currentValue: any = this.effectiveValues.get(key);
		const locked: boolean = this.parent.isLocked(key);
		const newValue: any = (locked || !this.localValues.has(key)) ? parentValue : localValue;
		const different: boolean = !equals(1000, currentValue, newValue);

		this.effectiveValues.put(key, newValue);

		if (different) {
			this.notify(key, newValue);
		}
	}

}

export default PropertiesImpl;
