interface Properties {

	get<T>(key: string): T;

	attributesOf(key: string): PropFlagVals;

	extend(): MutableProperties;

	isDefined(key: string): boolean;

	isTruthy(key: string): boolean;

	familyGroupKeysFrom(key: string, immuteToo: boolean): string[];

	getAsString(key: string): string;

}

interface PropFlagVals {
	key: string;
	write: boolean;
	delete: boolean;
}

interface MutableProperties extends Properties {

	set(key: string, value: any): MutableProperties;

	load(values: any): MutableProperties;

	remove(key: string): MutableProperties;

	clear(): MutableProperties;

}

export {
	Properties,
	MutableProperties,
	PropFlagVals
};
