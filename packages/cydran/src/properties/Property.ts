import SimpleMap from "interface/SimpleMap";

interface Properties {

	/**
	 * Add an observer for all property changes.
	 * @param thisObject Object used as this when calling the callback
	 * @param callback - callback function to be called when any property is changed
	 */
	addObserver(thisObject: Object, callback: (key: string, value: unknown) => void): void;

	/**
	 * Remove an observer that listened for all property changes.
	 * @param thisObject Object used as this when calling the callback
	 * @param callback callback function to be removed
	 */
	removeObserver(thisObject: Object, callback: (key: string, value: unknown) => void): void;

	/**
	 * Add an observer for a specific property changes, or changes of more general property when the preferred is unavailable.
	 * @param thisObject Object used as this when calling the callback
	 * @param callback callback function to be called when the specific property is changed
	 * @param preferredKey Preferred property key to observe
	 * @param prefix Property key prefix for keys which should be included for consideration 
	 */
	addFallbackObserver(thisObject: Object, callback: (key: string, value: unknown) => void, preferredKey: string, prefix?: string): void;

	/**
	 * Remove an observer for a specific property changes, or changes of more general property when the preferred is unavailable.
	 * @param thisObject Object used as this when calling the callback
	 * @param callback callback function to be removed
	 */
	removeFallbackObserver(thisObject: Object, callback: (key: string, value: unknown) => void): void;

	/**
	 * Add an observer for specific property.
	 * @param key Specific property key
	 * @param thisObject Object used as this when calling the callback
	 * @param callback callback function to be called when the specific property is changed
	 */
	addPropertyObserver(key: string, thisObject: Object, callback: (value: unknown) => void): void;

	/**
	 * Remove an observer for specific property.
	 * @param key Specific property key
	 * @param thisObject Object used as this when calling the callback
	 * @param callback callback function to remove
	 */
	removePropertyObserver(key: string, thisObject: Object, callback: (value: unknown) => void): void;

	snapshot(): MutableProperties;

	/**
	 * Get all the keys present in the properties object
	 * @returns - array of string values
	 */		
	keys(): string[];

	/**
	 * Get the defined property object
	 * @param key - property key value
	 * @returns - typed property object
	 */
	get<T>(key: string): T;

	/**
	 * Get the defined property object or a fallback property object if the preferred is unavailable
	 * @param preferredKey - property key value
	 * @param prefix - prefix to limit candidate keys
	 * @returns - typed property object
	 */
	getWithFallback<T>(preferredKey: string, prefix?: string): T;

	/**
	 * Indicates whether a property is defined.
	 * @param key Property key
	 */
	// TODO - Change name to exists
	includes(key: string): boolean;

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
	set(key: string, value: unknown): MutableProperties;

	/**
	 * Load additional properties in
	 * @param values - any type of object
	 * @returns
	 */
	load(values: SimpleMap<unknown>): MutableProperties;

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
