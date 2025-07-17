import { Context } from "context/Context";
import { concat, defaulted, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ObjectArgumentResolver implements ArgumentResolver<unknown> {

	private id: string;

	private instanceArguments: unknown[];	

	constructor(id: string, instanceArguments: unknown[]) {
		this.id = requireValid(id, "id", OBJECT_ID);
		this.instanceArguments = defaulted(instanceArguments, []);
	}

	public resolve(context: Context): unknown {
		const argsToPass: unknown[] = concat([this.id], this.instanceArguments);

		// eslint-disable-next-line prefer-spread
		return context.getObject.apply(context, argsToPass);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: Object, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ObjectArgumentResolver;
