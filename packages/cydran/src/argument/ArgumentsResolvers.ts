interface ArgumentsResolvers {

	resolve(context: unknown, instanceArguments: unknown[]): unknown[];

	postProcess(context: unknown, targetObject: unknown, params: unknown[]): void;

}

export default ArgumentsResolvers;
