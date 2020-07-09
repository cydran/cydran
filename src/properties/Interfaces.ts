interface Properties {

	get<T>(key: string): T;

	extend(): MutableProperties;

	isDefined(key: string): boolean;

	isTruthy(key: string): boolean;

	getAsString(key: string): string;

}

interface MutableProperties extends Properties {

	set(key: string, value: any): Properties;

	load(values: any): Properties;

	remove(key: string): Properties;

}

export { Properties, MutableProperties };
