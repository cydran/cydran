import Factory from "registry/Factory";
import Gettable from "interface/ables/Gettable";

import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';
import PostProcessor from "registry/postprocessor/PostProcessor";
import ContextAwarePostProcessor from 'registry/postprocessor/ContextAwarePostProcessor';
import Releasable from "interface/ables/Releasable";

abstract class AbstractFunctionalFactory<T> implements Factory<T>, Releasable {

	private fn: (args: any[]) => T;

	private argumentResolvers: ArgumentsResolvers;

	private context: Context;

	private postProcessors: PostProcessor<any>[];

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		this.postProcessors = [new ContextAwarePostProcessor()]; // TODO - Make this configurable
		this.context = requireNotNull(context, "context");
		this.fn = requireNotNull(fn, "fn");
		this.argumentResolvers = requireNotNull(argumentResolvers, "argumentResolvers");
	}

	public abstract get(gettable: Gettable, instanceArguments: any[]): T;

	protected create(gettable: Gettable, instanceArguments: any[] = []) {
		const params: any[] = this.argumentResolvers.resolve(this.context, instanceArguments);
		const result: T = this.fn.apply({}, params);
		this.argumentResolvers.postProcess(this.context, result, params);

		for (const postProcessor of this.postProcessors) {
			postProcessor.postProcess(this.context, result);
		}

		return result;
	}

	public abstract $release(): void;

}

export default AbstractFunctionalFactory;
