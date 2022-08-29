interface ArgumentsResolvers {

	resolve(context: any): any[];

	postProcess(context: any, targetObject: any, params: any[]): void;

}

export default ArgumentsResolvers;
