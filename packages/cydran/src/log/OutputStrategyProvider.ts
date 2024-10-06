import SimpleMap from "interface/SimpleMap";
import { OutputStrategy, StrategyResolver } from "log/strategy/OutputStrategy";
import ConsoleAppender from "log/appender/ConsoleAppender";
import { requireNotNull } from 'util/Utils';
import { OutputStrategyError } from "error/Errors";
import { DEFAULT_LOG_STRATEGY } from "CydranConstants";
import { IdGenerator } from "util/IdGenerator";

const LS: string = "logging strategy" as const;

class OutputStrategyProvider {

	private stratResolvers: SimpleMap<StrategyResolver>;

	private defStrat: OutputStrategy;

	constructor() {
		this.defStrat = new ConsoleAppender(IdGenerator.generate());
		this.reset();
	}

	public reset(): void {
		this.stratResolvers = {};
		this.registerStrategy(DEFAULT_LOG_STRATEGY, () => { return this.defStrat; } );
	}

	public registerStrategy(key: string, stratFn: StrategyResolver, force: boolean = false): void {
		requireNotNull(key, "key");
		requireNotNull(stratFn, "stratFn");
		if(!this.stratResolvers[key]) {
			this.stratResolvers[key] = stratFn;
		} else {
			if(force && this.isNotDefault(key)) {
				this.stratResolvers[key] = stratFn;
			} else {
				throw new OutputStrategyError(`"${ key }" ${ LS } not replaceable. Use unique key.`);
			}
		}
	}

	public removeStrategy(key: string): void {
		requireNotNull(key, "key");
		if(this.stratResolvers[key]) {
			if(this.isNotDefault(key)) {
				delete this.stratResolvers[key];
			} else {
				throw new OutputStrategyError(`Removal of the "${ key }" ${ LS } not allowed`);
			}
		}
	}

	private isNotDefault(key: string): boolean {
		return (key.toLowerCase() !== DEFAULT_LOG_STRATEGY);
	}

	public getStrategy(key: string = DEFAULT_LOG_STRATEGY): OutputStrategy {
		const resolver: StrategyResolver = this.stratResolvers[key] || this.stratResolvers[DEFAULT_LOG_STRATEGY];
		return resolver();
	}
}

export default OutputStrategyProvider;
