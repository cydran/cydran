import { ArgumentBuilder, StageBuilder } from "stage/Stage";
import ArgumentsHolder from "stage/ArgumentsHolder";
import ArgumentsHolderImpl from "stage/ArgumentsHolderImpl";
import Module from "module/Module";
import PubSubImpl from "message/PubSubImpl";
import Gettable from "interface/ables/Gettable";
import { requireNotNull } from "util/Utils";

class ArgumentBuilderImpl implements ArgumentBuilder {

	private stageBldr: StageBuilder;
	private module: Module;
	private args: ArgumentsHolder;

	constructor(stageBldr: StageBuilder, moduleId?: string) {
		this.stageBldr = stageBldr;
		this.args = new ArgumentsHolderImpl();
		this.module = moduleId ? this.stageBldr.getModule(moduleId) : this.stageBldr.getDefaultModule();
	}

	with(id: string): ArgumentBuilder {
		this.args.add(this.module.get(id));
		return this;
	}

	withPubSub(): ArgumentBuilder {
		const pubSub: PubSubImpl = new PubSubImpl(null, this.module);
		this.args.add(pubSub);
		// TODO: needs more here... not sure what to do beyond this.
		return this;
	}

	withFunction(fn: Function): ArgumentBuilder {
		this.args.add(fn);
		return this;
	}

	withConstant(arg: string | boolean | Object): ArgumentBuilder {
		this.args.add(arg);
		return this;
	}

	withProperty(id: string): ArgumentBuilder {
		requireNotNull(id, "id");
		const prop: string = this.module.getProperties().get(id);
		this.args.add(prop);
		return this;
	}

	and(): StageBuilder {
		return this.stageBldr;
	}

}

export default ArgumentBuilderImpl;
