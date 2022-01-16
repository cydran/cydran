import { ArgumentsResolversBuilder, StageBuilder } from "stage/Stage";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from 'argument/ConstantArgumentResolver';
import FunctionArgumentResolver from "argument/FunctionArgumentResolver";
import PropertyArgumentResolver from 'argument/PropertyArgumentResolver';
import ObjectArgumentResolver from "argument/ObjectArgumentResolver";
import PubSubArgumentResolver from 'argument/PubSubArgumentResolver';
import AbstractBuilderImpl from 'pattern/AbstractBuilderImpl';
import ScopeItemArgumentResolver from "argument/ScopeItemArgumentResolver";
import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";

class ArgumentResolversBuilderImpl extends AbstractBuilderImpl<ArgumentsResolvers, ArgumentsResolversImpl> implements ArgumentsResolversBuilder {

	constructor() {
		super(new ArgumentsResolversImpl());
	}

	public with(id: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ObjectArgumentResolver(id));
		return this;
	}

	withInstanceId(): ArgumentsResolversBuilder {
		this.getInstance().add(new InstanceIdArgumentResolver());
		return this;
	}

	withPubSub(): ArgumentsResolversBuilder {
		this.getInstance().add(new PubSubArgumentResolver());
		return this;
	}

	withFunction(fn: () => any): ArgumentsResolversBuilder {
		this.getInstance().add(new FunctionArgumentResolver(fn));
		return this;
	}

	withConstant(value: any): ArgumentsResolversBuilder {
		this.getInstance().add(new ConstantArgumentResolver(value));
		return this;
	}

	withProperty(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyArgumentResolver(name));
		return this;
	}

	withScopeItem(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ScopeItemArgumentResolver(name));
		return this;
	}

	protected validate(reportError: (message: string) => void): void {
		// Intentionally do nothing for now
	}

}

export default ArgumentResolversBuilderImpl;
