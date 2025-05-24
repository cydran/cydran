import ArgumentsResolvers from "argument/ArgumentsResolvers";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from 'argument/resolver/ConstantArgumentResolver';
import FunctionArgumentResolver from "argument/resolver/FunctionArgumentResolver";
import PropertyArgumentResolver from 'argument/resolver/PropertyArgumentResolver';
import ObjectArgumentResolver from "argument/resolver/ObjectArgumentResolver";
import TransmitterArgumentResolver from 'argument/resolver/TransmitterArgumentResolver';
import AbstractBuilderImpl from 'pattern/AbstractBuilderImpl';
import ScopeItemArgumentResolver from "argument/resolver/ScopeItemArgumentResolver";
import InstanceIdArgumentResolver from "argument/resolver/InstanceIdArgumentResolver";
import InstanceIdFnArgumentResolver from "argument/resolver/InstanceIdFnArgumentResolver";
import LoggerArgumentResolver from "argument/resolver/LoggerArgumentResolver";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import ContextArgumentResolver from "argument/resolver/ContextArgumentResolver";
import ProviderArgumentResolver from "argument/resolver/ProviderArgumentResolver";
import PropertyProviderArgumentResolver from "argument/resolver/PropertyProviderArgumentResolver";
import ArgumentArgumentResolver from "./resolver/ArgumentArgumentResolver";
import PropertySubscriberArgumentResolver from "./resolver/PropertySubscriberArgumentResolver";
import ReceiverArgumentResolver from "./resolver/ReceiverArgumentResolver";
import MessageSubscriberArgumentResolver from "./resolver/MessageSubscriberArgumentResolver";
import PropertyFallbackSubscriberArgumentResolver from "./resolver/PropertyFallbackSubscriberArgumentResolver";

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

	public with(id: string, ...instanceArguments: unknown[]): ArgumentsResolversBuilder {
		this.getInstance().add(new ObjectArgumentResolver(id, instanceArguments));
		return this;
	}

	public withInstanceId(): ArgumentsResolversBuilder {
		this.getInstance().add(new InstanceIdArgumentResolver());
		return this;
	}

	public withInstanceIdProvider(): ArgumentsResolversBuilder {
		this.getInstance().add(new InstanceIdFnArgumentResolver());
		return this;
	}

	public withLogger(key: string, label?: string): ArgumentsResolversBuilder {
		this.getInstance().add(new LoggerArgumentResolver(key, label));
		return this;
	}

	public withTransmitter(): ArgumentsResolversBuilder {
		this.getInstance().add(new TransmitterArgumentResolver());
		return this;
	}

	public withReceiver(): ArgumentsResolversBuilder {
		this.getInstance().add(new ReceiverArgumentResolver());
		return this;
	}

	public withMessageSubscriber(): ArgumentsResolversBuilder {
		this.getInstance().add(new MessageSubscriberArgumentResolver());
		return this;
	}

	public withFunction<T>(fn: () => T): ArgumentsResolversBuilder {
		this.getInstance().add(new FunctionArgumentResolver(fn));
		return this;
	}

	public withConstant<T>(value: T): ArgumentsResolversBuilder {
		this.getInstance().add(new ConstantArgumentResolver(value));
		return this;
	}

	public withProperty(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyArgumentResolver(name));
		return this;
	}

	public withPropertyProvider(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyProviderArgumentResolver(name));
		return this;
	}

	public withPropertySubscriber(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertySubscriberArgumentResolver(name));
		return this;
	}

	public withPropertyFallbackSubscriber(preferredKey: string, prefix?: string): ArgumentsResolversBuilder {
		this.getInstance().add(new PropertyFallbackSubscriberArgumentResolver(preferredKey, prefix));
		return this;
	}

	public withScopeItem(name: string): ArgumentsResolversBuilder {
		this.getInstance().add(new ScopeItemArgumentResolver(name));
		return this;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected validate(reportError: (message: string) => void): void {
		// Intentionally do nothing for now
	}

}

export default ArgumentResolversBuilderImpl;
