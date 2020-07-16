interface Properties {

	get<T>(key: string): T;

	extend(): MutableProperties;

	isDefined(key: string): boolean;

	isTruthy(key: string): boolean;

	getAsString(key: string): string;

}

interface MutableProperties extends Properties {

	set(key: string, value: any): MutableProperties;

	load(values: any): MutableProperties;

	remove(key: string): MutableProperties;

	clear(): MutableProperties;

}

export { Properties, MutableProperties };
