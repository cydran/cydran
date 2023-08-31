import { Context } from "context/Context";

interface ArgumentResolver {

	resolve(context: Context, ...instanceArguments: any[]): any;

	postProcess(context: Context, targetObject: any, param: any): void;

}

export default ArgumentResolver;
