import { Context } from "context/Context";

interface ArgumentResolver<T> {

	resolve(context: Context, instanceArguments: unknown[]): T;

	postProcess(context: Context, targetObject: unknown, param: unknown): void;

}

export default ArgumentResolver;
