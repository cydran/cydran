interface Properties {
	/**
	 * Get the defined property object
	 * @param key - property key value
	 * @returns - typed property object
	 */
	get<T>(key: string): T;

	/**
	 * Meta information about the property
	 * @param key - string value
	 * @returns - object of meta-data
	 */
	attributesOf(key: string): PropFlagVals;

	/**
	 * Get a mutable inheriting child {@link Properties} object
	 * @returns - properties object
	 */
	extend(): MutableProperties;

	/**
	 * Is the property indexed at the "key" defined
	 * @param key - string value
	 * @returns - property existance
	 */
	isDefined(key: string): boolean;

	/**
	 * Can the defined property value identified by key be expressed as "truthy"
	 * @param key - string value
	 * @returns - is truthy
	 */
	isTruthy(key: string): boolean;

	/**
	 * Get keys associated with a particular key family prefix; i.e. 'cydran.logging'
	 * @param key - string value
	 * @param immuteToo - should keys representing immutable properties be included in the result.  The default is false if no argument value is inlcuded (null, undefined)
	 * @returns - array of property keys matching the equivilant to: value.indexOf(key) === 0
	 */
	familyGroupKeysFrom(key: string, immuteToo: boolean): string[];

	/**
	 * Get the string representation of the property indicated by the key
	 * @param key - string value
	 * @returns - string value representation
	 */
	getAsString(key: string): string;

}

interface PropFlagVals {
	/**
	 * Key value of property
	 */
	key: string;

	/**
	 * If the property is writeable
	 */
	write: boolean;

	/**
	 * If the property is deletable
	 */
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
