interface ArgumentsResolvers {

	resolve(context: any): any[];

	postProcess(context: any, target: any, params: any[]): void;

}

export default ArgumentsResolvers;
