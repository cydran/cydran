import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { isDefined, requireNotNull } from "util/Utils";
import ArgumentResolver from "argument/ArgumentResolver";
import { Context } from "context/Context";
import Releasable from "interface/ables/Releasable";

class ArgumentsResolversImpl implements ArgumentsResolvers, Releasable {

	private resolvers: ArgumentResolver<unknown>[];

	constructor() {
		this.resolvers = [];
	}

	public add<T>(resolver: ArgumentResolver<T>): void {
		requireNotNull(resolver, "resolver");
		this.resolvers.push(resolver);
	}

	public resolve(context: unknown, instanceArguments: unknown[] = []): unknown[] {
		requireNotNull(context, "context");

		if (!isDefined(this.resolvers)) {
			this.resolvers = [];
		}

		const contextInstance: Context = context as Context;

		const results: unknown[] = [];

		for (const resolver of this.resolvers) {
			const value: unknown = resolver.resolve(contextInstance, instanceArguments);

			results.push(value);
		}

		return results;
	}

	public postProcess(context: unknown, targetObject: unknown, params: unknown[]): void {
		requireNotNull(context, "context");

		if (this.resolvers.length === 0) {
			return;
		}

		const contextInstance: Context = context as Context;

		for (let i: number = 0; i < this.resolvers.length; i++) {
			const resolver: ArgumentResolver<unknown> = this.resolvers[i];
			const param: unknown = params[i];
			resolver.postProcess(contextInstance, targetObject, param);
		}
	}

	public $release(): void {
		this.resolvers = null;
	}

}

export default ArgumentsResolversImpl;
