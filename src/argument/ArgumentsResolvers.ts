interface ArgumentsResolvers {

	resolve(context: any, ...instanceArguments: any[]): any[];

	postProcess(context: any, targetObject: any, params: any[]): void;

}

export default ArgumentsResolvers;
