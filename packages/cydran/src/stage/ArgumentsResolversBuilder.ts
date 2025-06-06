import Builder from "pattern/Builder";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';

interface ArgumentsResolversBuilder extends Builder<ArgumentsResolvers> {

	/**
	 * Intent to resolve a registered object in the Cydran service discovery functionality
	 * @param id unique string key of the registered object
	 */
	with(id: string, ...instanceArguments: any[]): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve function that will return a registered object in the Cydran service discovery functionality when invoked
	 * @param id unique string key of the registered object
	 */
	withProvider(id: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran {Transmitter} instance
	 */
	withTransmitter(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran {Receiver} instance
	 */
	withReceiver(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran subscriber function
	 */
	withMessageSubscriber(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve an id instance value provided by the Cydran id generation mechanism
	 */
	withInstanceId(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve the function that Cydran utilizes for instance id generation
	 */
	withInstanceIdProvider(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve the current context.
	 */
	withContext(): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a provided argument at the time of the object being requested.
	 * @param index Index of the argument that will be passed
	 */
	withArgument(index: number): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran {Logger} instance
	 * @param name - of the {Logger} instance
	 * @param level - optional value representation of logging threshold
	 */
	// TODO - Use key / label instead of name
	withLogger(name: string, level?: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a defined function
	 * @param fn function to resolve
	 */
	withFunction(fn: () => any): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve raw constant value
	 * @param value treated as a literal constant
	 */
	withConstant(value: any): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a Cydran or application {Properties property} value
	 * @param name property key name
	 */
	withProperty(name: string): ArgumentsResolversBuilder;

	/**
	 * Intent to provide a function to resolve a Cydran or application {Properties property} value when invoked
	 * @param name property key name
	 */
	withPropertyProvider(name: string): ArgumentsResolversBuilder;

	/**
	 * Intent to provide a function with which callbacks can registered for a given property
	 * @param name property key name
	 */
	withPropertySubscriber(name: string): ArgumentsResolversBuilder;

	/**
	 * Intent to provide a function with which fallback callbacks can registered for a given property
	 * @param preferredKey preferred property key name
	 * @param prefix optional prefix for the property key
	 */
	withPropertyFallbackSubscriber(preferredKey: string, prefix?: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a registered object found within one of the Cydran scopes
	 * @param name key of object in the scope
	 */
	withScopeItem(name: string): ArgumentsResolversBuilder;

}

export default ArgumentsResolversBuilder;
