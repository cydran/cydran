interface Properties {

	addObserver(callback: (key: string, value: any) => void);

	removeObserver(callback: (key: string, value: any) => void);

	addPropertyObserver(key: string, callback: (value: any) => void);

	removePropertyObserver(key: string, callback: (value: any) => void);

	addGroupObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	removeGroupObserver(preferredKey: string, prefix: string, suffix: string, callback: (value: any) => void);

	snapshot(): MutableProperties;

	keys(): string[];

	/**
	 * Get the defined property object
	 * @param key - property key value
	 * @returns - typed property object
	 */
	get<T>(key: string): T;

	/**
	 * Indicates whether a property is defined.
	 * @param key Property key
	 */
	// TODO - Change name to exists
	includes(key: string): boolean;

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
	 * @returns - property existence
	 */
	isDefined(key: string): boolean;

	/**
	 * Can the defined property value identified by key be expressed as "truthy"
	 * @param key - string value
	 * @returns - is truthy
	 */
	isTruthy(key: string): boolean;

	/**
	 * Can the defined property value identified by key be expressed as "falsy"
	 * @param key - string value
	 * @returns - is truthy
	 */
	isFalsy(key: string): boolean;

	/**
	 * Indicates whether a specific property is locked.
	 * @param key - string value
	 */
	isLocked(key: string): boolean;

	/**
	 * Indicates whether a specific property is pinned.
	 * @param key - string value
	 */
	isPinned(key: string): boolean;

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

	/**
	 * Set a property value
	 * @param key - string value
	 * @param value - any type of object
	 * @returns
	 */
	set(key: string, value: any): MutableProperties;

	/**
	 * Load additional properties in
	 * @param values - any type of object
	 * @returns
	 */
	load(values: any): MutableProperties;

	/**
	 * Remove a specific property by key
	 * @param key - string value
	 * @returns
	 */
	remove(key: string): MutableProperties;

	/**
	 * Clear the current properties instance object of all values
	 * @returns
	 */
	clear(): MutableProperties;

	/**
	 * Locks one or more properties.
	 * @param keys keys of the properties to lock
	 */
	lock(...keys: string[]): MutableProperties;

	/**
	 * Unlocks one or more properties.
	 * @param keys keys of the properties to unlock
	 */
	unlock(...keys: string[]): MutableProperties;

	/**
	 * Locks one or more properties.
	 * @param keys keys of the properties to lock
	 */
	pin(...keys: string[]): MutableProperties;

	/**
	 * Unlocks one or more properties.
	 * @param keys keys of the properties to unlock
	 */
	unpin(...keys: string[]): MutableProperties;


	/**
	 * Modifies a property by applying a function to the current value to derive a new value for the property.
	 * @param key key of the property to modify
	 * @param modifierFn Function with which to modify the property
	 */
	modify<T>(key: string, modifierFn: (value: T) => T): MutableProperties;

	mirror(source: Properties): MutableProperties;

}

export {
	Properties,
	MutableProperties,
	PropFlagVals
};
