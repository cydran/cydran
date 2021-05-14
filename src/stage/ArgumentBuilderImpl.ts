import { ArgumentBuilder, StageBuilder } from "stage/Stage";

class ArgumentBuilderImpl implements ArgumentBuilder {

	private stageBldr: StageBuilder;

	constructor(stageBldr: StageBuilder) {
		this.stageBldr = stageBldr;
	}

	with(id: string): ArgumentBuilder {
		// TODO: getting an object from service discovery
		return this;
	}

	withPubSub(): ArgumentBuilder {
		// TODO: getting the pubSub object
		return this;
	}

	withFunction(fn: Function): ArgumentBuilder {
		// TODO: for an executing function
		return this;
	}

	withConstant(arg: string | boolean | Object): ArgumentBuilder {
		// TODO: setting a constant value
		return this;
	}

	withProperty(id: string): ArgumentBuilder {
		// TODO: defer getting property value
		return this;
	}

	and(): StageBuilder {
		return this.stageBldr;
	}

}

export default ArgumentBuilderImpl;
