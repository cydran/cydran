import Module from "module/Module";
import { requireNotNull } from "util/Utils";
import ArgumentResolver from './ArgumentResolver';

class ObjectArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireNotNull(id, "id");
	}

	public resolve(module: Module): any {
		const instance: any = module.get(this.id);

		return instance;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ObjectArgumentResolver;
