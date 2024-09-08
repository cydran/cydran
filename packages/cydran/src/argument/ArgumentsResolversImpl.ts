import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { isDefined, requireNotNull } from "util/Utils";
import ArgumentResolver from "argument/ArgumentResolver";
import { Context } from "context/Context";
import Releasable from "interface/ables/Releasable";

class ArgumentsResolversImpl implements ArgumentsResolvers, Releasable {

	private resolvers: ArgumentResolver[];

	constructor() {
		this.resolvers = [];
	}

	public add(resolver: ArgumentResolver): void {
		requireNotNull(resolver, "resolver");
		this.resolvers.push(resolver);
	}

	public resolve(context: any, instanceArguments: any[] = []): any[] {
		requireNotNull(context, "context");

		if (!isDefined(this.resolvers)) {
			this.resolvers = [];
		}

		const contextInstance: Context = context as Context;

		const results: any[] = [];

		for (const resolver of this.resolvers) {
			const value: any = resolver.resolve(contextInstance, instanceArguments);

			results.push(value);
		}

		return results;
	}

	public postProcess(context: any, targetObject: any, params: any[]): void {
		requireNotNull(context, "context");

		if (this.resolvers.length === 0) {
			return;
		}

		const contextInstance: Context = context as Context;

		for (let i: number = 0; i < this.resolvers.length; i++) {
			const resolver: ArgumentResolver = this.resolvers[i];
			const param: any = params[i];
			resolver.postProcess(contextInstance, targetObject, param);
		}
	}

	public $release(): void {
		this.resolvers = null;
	}

}

export default ArgumentsResolversImpl;
