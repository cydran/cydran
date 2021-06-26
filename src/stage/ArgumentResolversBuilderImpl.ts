import { ArgumentsResolversBuilder, StageBuilder } from "stage/Stage";
import ArgumentsResolvers from "stage/ArgumentsResolvers";
import ArgumentsResolversImpl from "stage/ArgumentsResolversImpl";
import ConstantArgumentResolver from 'stage/ConstantArgumentResolver';
import FunctionArgumentResolver from "stage/FunctionArgumentResolver";
import PropertyArgumentResolver from 'stage/PropertyArgumentResolver';
import ObjectArgumentResolver from "stage/ObjectArgumentResolver";
import PubSubArgumentResolver from 'stage/PubSubArgumentResolver';
import AbstractBuilderImpl from 'pattern/AbstractBuilderImpl';
import ScopeItemArgumentResolver from "stage/ScopeItemArgumentResolver";

class ArgumentResolversBuilderImpl extends AbstractBuilderImpl<ArgumentsResolvers, ArgumentsResolversImpl> implements ArgumentsResolversBuilder {

	constructor() {
		super(new ArgumentsResolversImpl());
	}

	public with(id: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ObjectArgumentResolver(id));
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
