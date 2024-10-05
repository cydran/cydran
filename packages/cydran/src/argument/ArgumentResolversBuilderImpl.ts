import ArgumentsResolvers from "argument/ArgumentsResolvers";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from 'argument/resolver/ConstantArgumentResolver';
import FunctionArgumentResolver from "argument/resolver/FunctionArgumentResolver";
import PropertyArgumentResolver from 'argument/resolver/PropertyArgumentResolver';
import ObjectArgumentResolver from "argument/resolver/ObjectArgumentResolver";
import PubSubArgumentResolver from 'argument/resolver/PubSubArgumentResolver';
import AbstractBuilderImpl from 'pattern/AbstractBuilderImpl';
import ScopeItemArgumentResolver from "argument/resolver/ScopeItemArgumentResolver";
import InstanceIdArgumentResolver from "argument/resolver/InstanceIdArgumentResolver";
import InstanceIdFnArgumentResolver from "argument/resolver/InstanceIdFnArgumentResolver";
import LoggerArgumentResolver from "argument/resolver/LoggerArgumentResolver";
import OutputStrategyResolver from "argument/resolver/OutputStrategyResolver";
import { OutputStrategy } from "log/strategy/OutputStrategy";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import ContextArgumentResolver from "argument/resolver/ContextArgumentResolver";
import ProviderArgumentResolver from "argument/resolver/ProviderArgumentResolver";
import PropertyProviderArgumentResolver from "argument/resolver/PropertyProviderArgumentResolver";
import ArgumentArgumentResolver from "./resolver/ArgumentArgumentResolver";
import PropertyHookArgumentResolver from "./resolver/PropertyHookArgumentResolver";

class ArgumentResolversBuilderImpl extends AbstractBuilderImpl<ArgumentsResolvers, ArgumentsResolversImpl> implements ArgumentsResolversBuilder {

	constructor() {
		super(new ArgumentsResolversImpl());
	}

	public withArgument(index: number): ArgumentsResolversBuilder {
		this.getInstance().add(new ArgumentArgumentResolver(index));
		return this;
	}

	public withContext(): ArgumentsResolversBuilder {
		this.getInstance().add(new ContextArgumentResolver());
		return this;
	}

	public withProvider(id: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ProviderArgumentResolver(id));
		return this;
	}

	public with(id: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ObjectArgumentResolver(id));
		return this;
	}

	withInstanceId(): ArgumentsResolversBuilder {
		this.getInstance().add(new InstanceIdArgumentResolver());
		return this;
	}

	withInstanceIdProvider(): ArgumentsResolversBuilder {
		this.getInstance().add(new InstanceIdFnArgumentResolver());
		return this;
	}

	withLogger(name: string, level: string = "unknown", strategy?: OutputStrategy): ArgumentsResolversBuilder {
		this.getInstance().add(new LoggerArgumentResolver(name, level, strategy));
		return this;
	}

	withLoggerOutputStrategy(id: string, strategy: OutputStrategy): ArgumentsResolversBuilder {
		this.getInstance().add(new OutputStrategyResolver(id, strategy));
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

	public withPropertyProvider(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyProviderArgumentResolver(name));
		return this;
	}
	withPropertyHook(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyHookArgumentResolver(name));
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
