import { MutableProperties, PropFlagVals } from "properties/Property";
import AdvancedMap from 'pattern/AdvancedMap';
import { requireNotNull, isDefined, equals } from 'util/Utils';
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { asString } from 'util/AsFunctions';
import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";

abstract class AbstractPropertiesImpl implements MutableProperties {

	private observers: Observable;

	private propertyObservers: AdvancedMap<Observable>;

	constructor() {
		this.observers = new ObservableImpl();
		this.propertyObservers = new AdvancedMapImpl<Observable>();
	}

	public isLocked(key: string): boolean {
		return false;
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

	public remove(key: string): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public clear(): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public abstract get<T>(key: string): T;

	public extend(): MutableProperties {
		const child: ChildPropertiesImpl = new ChildPropertiesImpl(this);

		return child;
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
		return asString(value);
	}

	protected notify(name: string, value: any): void {
		requireNotNull(name, "name");

		if (this.propertyObservers.has(name)) {
			this.propertyObservers.get(name).notify(value);
		}

		this.observers.notify(name, value);
	}

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

	public get<T>(key: string): T {
		return this.values.get(key);
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");
		this.values.put(key, value);
		this.notify(key, value);

		return this;
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
	}

	public get<T>(key: string): T {
		return this.effectiveValues.get(key);
	}

	public set(key: string, value: any): MutableProperties {
		requireNotNull(key, "key");
		this.localValues.put(key, value);
		this.reevaluateProperty(key);

		return this;
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
