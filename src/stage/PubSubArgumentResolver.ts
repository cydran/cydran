import PubSubImpl from "message/PubSubImpl";
import Module from "module/Module";
import ArgumentResolver from 'stage/ArgumentResolver';

class PubSubArgumentResolver implements ArgumentResolver {

	public resolve(module: Module): any {
		return new PubSubImpl(null, module);
	}

	public postProcess(module: Module, target: any, param: any): void {
		const pubSub: PubSubImpl = param as PubSubImpl;
		pubSub.setContext(target);
	}

}

export default PubSubArgumentResolver;
