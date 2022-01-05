import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { isDefined, requireNotNull } from "util/Utils";
import Disposable from "interface/ables/Disposable";
import ArgumentResolver from "argument/ArgumentResolver";
import Module from "module/Module";

class ArgumentsResolversImpl implements ArgumentsResolvers, Disposable {

	private resolvers: ArgumentResolver[];

	constructor() {
		this.resolvers = [];
	}

	public add(resolver: ArgumentResolver): void {
		requireNotNull(resolver, "resolver");
		this.resolvers.push(resolver);
	}

	public resolve(context: any): any[] {
		if(!isDefined(this.resolvers)) {
			this.resolvers = [];
		}
		const module: Module = context as Module;

		const results: any[] = [];
		for (const resolver of this.resolvers) {
			const value: any = resolver.resolve(module);

			results.push(value);
		}

		return results;
	}

	public postProcess(context: any, target: any, params: any[]): void {
		if (this.resolvers.length === 0) {
			return;
		}

		const module: Module = context as Module;

		for (let i: number = 0; i < this.resolvers.length; i++) {
			const resolver: ArgumentResolver = this.resolvers[i];
			const param: any = params[i];
			resolver.postProcess(module, target, param);
		}
	}

	public $dispose(): void {
		this.resolvers = null;
	}

}

export default ArgumentsResolversImpl;
