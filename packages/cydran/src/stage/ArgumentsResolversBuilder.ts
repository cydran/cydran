import Builder from "pattern/Builder";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import { OutputStrategy } from "log/OutputStrategy";

interface ArgumentsResolversBuilder extends Builder<ArgumentsResolvers> {

	/**
	 * Intent to resolve a registered object in the Cydran service discovery functionality
	 * @param id unique string key of the registered object
	 */
	with(id: string): ArgumentsResolversBuilder;

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
	 * @param strategy - optional argument to override default {OutputStrategy}
	 */
	withLogger(name: string, level?: string, strategy?: OutputStrategy): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a logging {OutputStrategy} to be utilized
	 * @param id - key of the strategy
	 * @param strategy - mechanism of logging
	 */
	withLoggerOutputStrategy(id: string, strategy: OutputStrategy): ArgumentsResolversBuilder;

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
	// TODO - Think more deeply about the term hook and if it should be the term used
	withPropertyHook(name: string): ArgumentsResolversBuilder;

	/**
	 * Intent to resolve a registered object found within one of the Cydran scopes
	 * @param name key of object in the scope
	 */
	withScopeItem(name: string): ArgumentsResolversBuilder;

}

export default ArgumentsResolversBuilder;
