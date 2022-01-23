import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import IdGenerator from "util/IdGenerator";

class InstanceIdArgumentResolver implements ArgumentResolver {

	private bucketSize: number = 1;

	constructor(count: number = 1) {
		this.bucketSize = count;
	}

	public resolve(module: Module): any {
		const retval: string[] = [];
		for(let x:number = 0; x < this.bucketSize; x++) {
			retval.push(IdGenerator.INSTANCE.generate());
		}
		return (this.bucketSize === 1) ? retval[0] : retval;
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default InstanceIdArgumentResolver;
