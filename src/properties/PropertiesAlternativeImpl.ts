import { MutableProperties, PropFlagVals } from "properties/Property";
import AdvancedMap from 'pattern/AdvancedMap';
import { requireNotNull, isDefined } from 'util/Utils';
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { asString } from 'util/AsFunctions';

abstract class AbstractPropertiesImpl implements MutableProperties {

	private children: ChildPropertiesImpl[];

	constructor() {
		this.children = [];
	}
 
	public set(key: string, value: any): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public load(values: any): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public remove(key: string): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public clear(): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public get<T>(key: string): T {
		throw new Error("Method not implemented.");
	}

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

	// TODO - Determine if the below methods still apply to the current situation

	public attributesOf(key: string): PropFlagVals {
		throw new Error("Method not implemented.");
	}

	public familyGroupKeysFrom(key: string, immuteToo: boolean): string[] {
		throw new Error("Method not implemented.");
	}

}

class PropertiesAlternativeImpl extends AbstractPropertiesImpl {

	private effectiveValues: AdvancedMap<any>;

	constructor() {
		super();
		this.effectiveValues = new AdvancedMapImpl<any>();
	}

}

class ChildPropertiesImpl extends AbstractPropertiesImpl {

	private parent: AbstractPropertiesImpl;

	constructor(parent: AbstractPropertiesImpl) {
		super();
		this.parent = requireNotNull(parent, "parent");
	}

}

export default PropertiesAlternativeImpl;
