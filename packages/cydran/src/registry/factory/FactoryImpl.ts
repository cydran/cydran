import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Gettable from "interface/ables/Gettable";
import CacheStrategy from "registry/cache/CacheStrategy";
import CreatorStrategy from "registry/creator/CreatorStrategy";
import Factory from "registry/factory/Factory";
import { defaulted, requireNotNull } from 'util/Utils';
import ArgumentResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import { Context } from "context/Context";
import PostProcessor from "registry/postprocessor/PostProcessor";
import ContextAwarePostProcessor from "registry/postprocessor/ContextAwarePostProcessor";

const EMPTY_ARGUMENT_RESOLVERS: ArgumentsResolvers = new ArgumentResolversBuilderImpl().build();

class FactoryAlternativeImpl<T, C> implements Factory<T, C> {

	private creator: CreatorStrategy<T>;

	private cache: CacheStrategy<T>;

	private resolvers: ArgumentsResolvers;

	private postProcessors: PostProcessor<any>[];

	private config: C;

	constructor(config: C, creator: CreatorStrategy<T>, cache: CacheStrategy<T>, resolvers: ArgumentsResolvers, localResolution: boolean) {
		this.config = requireNotNull(config, "config");
		this.creator = requireNotNull(creator, "creator");
		this.cache = requireNotNull(cache, "cache");
		this.resolvers = defaulted(resolvers, EMPTY_ARGUMENT_RESOLVERS);
		this.postProcessors = [new ContextAwarePostProcessor()]; // TODO - Make this configurable
	}

	public get(gettable: Gettable, instanceArguments: any[]): T {
		const value: T = this.cache.resolve(() => {
			const context: Context = gettable as unknown as Context;
			const params: any[] = this.resolvers.resolve(context, instanceArguments);
			const creationFn: (argumentValues: any[]) => T = this.creator.create();
			const result: T = creationFn.call({}, params);
			this.resolvers.postProcess(context, result, params);

			for (const postProcessor of this.postProcessors) {
				postProcessor.postProcess(context, result);
			}

			return result;
		});

		return value;
	}

	public $release(): void {
		this.creator.$release();
		this.config = null;
	}

	protected getConfig(): C {
		return this.config;
	}

}

export default FactoryAlternativeImpl;
