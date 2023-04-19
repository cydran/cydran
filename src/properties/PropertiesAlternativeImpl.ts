import { MutableProperties, PropFlagVals, Properties } from "properties/Property";
import AdvancedMap from 'pattern/AdvancedMap';
import { requireNotNull, isDefined, equals } from 'util/Utils';
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { asString } from 'util/AsFunctions';
import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";
import { UnknownPropertyError } from "error/Errors";
import StringSet from "pattern/StringSet";
import StringSetImpl from "pattern/StringSetImpl";

abstract class AbstractPropertiesImpl implements MutableProperties {

	private locks: StringSet;

	private observers: Observable;

	private propertyObservers: AdvancedMap<Observable>;

	constructor() {
		this.locks = new StringSetImpl();
		this.observers = new ObservableImpl();
		this.propertyObservers = new AdvancedMapImpl<Observable>();
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

	public abstract keys(): string[];

	public mirror(source: Properties): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public abstract includes(key: string): boolean;

	public lock(...names: string[]): MutableProperties {
		if (isDefined(names)) {
			for (const name of names) {
				this.locks.add(name);
				this.notify(name, this.get(name));
			}
		}

		return this;
	}

	public unlock(...names: string[]): MutableProperties {
		if (isDefined(names)) {
			for (const name of names) {
				this.locks.remove(name);
				this.notify(name, this.get(name));
			}
		}

		return this;
	}

	public modify<T>(name: string, modifierFn: (value: T) => T): MutableProperties {
		requireNotNull(name, "name");
		requireNotNull(modifierFn, "modifierFn");

		if (!this.includes(name)) {
			throw new UnknownPropertyError("Unknown property: " + name);
		}

		const previousValue: any = this.get(name);
		const newValue: any = modifierFn(previousValue);

		return newValue;
	}

	public isFalsy(key: string): boolean {
		return !this.isTruthy(key);
	}

	public isLocked(key: string): boolean {
		requireNotNull(key, "key");

		return this.locks.contains(key);
	}

	public isPinned(key: string): boolean {
		throw new Error("Method not implemented.");
	}

	public addObserver(callback: (name: string, value: any) => void) {
		requireNotNull(callback, "callback");

		this.observers.register(callback);
	}

	public removeObserver(callback: (name: string, value: any) => void) {
		requireNotNull(callback, "callback");

		this.observers.unregister(callback);
	}

	public addPropertyObserver(name: string, callback: (value: any) => void) {
		requireNotNull(name, "name");
		requireNotNull(callback, "callback");

		this.propertyObservers.computeIfAbsent(name, (key: string) => new ObservableImpl()).register(callback);
	}

	public removePropertyObserver(name: string, callback: (value: any) => void) {
		requireNotNull(name, "name");
		requireNotNull(callback, "callback");

		this.propertyObservers.computeIfAbsent(name, (key: string) => new ObservableImpl()).unregister(callback);
	}

	public abstract set(key: string, value: any): MutableProperties;

	public load(values: any): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public abstract remove(key: string): MutableProperties;

	public abstract clear(): MutableProperties;

	public abstract get<T>(key: string): T;

	public extend(): MutableProperties {
		const child: ChildPropertiesImpl = new ChildPropertiesImpl(this);

		return child;
	}

	public isDefined(key: string): boolean {
		return isDefined(this.get(key));
	}

	public isTruthy(key: string): boolean {
		requireNotNull(key, "key");
		const value: any = this.get(key);

		return isDefined(value) ? !!value : false;
	}

	public getAsString(key: string): string {
		const value: any = this.get(key);
		return asString(value);
	}

	protected notify(name: string, value: any): void {
		requireNotNull(name, "name");

		if (this.propertyObservers.has(name)) {
			this.propertyObservers.get(name).notify(value);
		}

		this.observers.notify(name, value);
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

class PropertiesAlternativeImpl extends AbstractPropertiesImpl {

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
		requireNotNull(key, "key");

		this.values.remove(key);

		return this;
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");
		this.values.put(key, value);
		this.sync();
		this.notify(key, value);

		return this;
	}

	public includes(key: string): boolean {
		requireNotNull(key, "key");

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
		this.parent.addObserver((name: string) => this.reevaluateProperty(name));
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
		requireNotNull(key, "key");
		this.localValues.put(key, value);
		this.reevaluateProperty(key);
		this.sync();

		return this;
	}

	public includes(key: string): boolean {
		requireNotNull(key, "key");

		return this.effectiveValues.has(key);
	}

	public remove(key: string): MutableProperties {
		requireNotNull(key, "key");

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

export default PropertiesAlternativeImpl;
