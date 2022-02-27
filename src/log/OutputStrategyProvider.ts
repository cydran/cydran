import SimpleMap from "interface/SimpleMap";
import OutputStrategy from "log/OutputStrategy";
import {Properties} from "properties/Property";
import PropertiesImpl from "properties/PropertiesImpl";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { requireNotNull } from 'util/Utils';
import { OutputStrategyError } from "error/Errors";

type StrategyResolver = () => OutputStrategy;

const LS: string = "logging strategy" as const;

class OutputStrategyProvider {
	private readonly DEFAULT_STRAT_KEY: string = "default";
	private stratResolvers: SimpleMap<StrategyResolver>;
	private defStrat: OutputStrategy;

	constructor(props: Properties = new PropertiesImpl()) {
		this.defStrat = new ConsoleOutputStrategy(props);
		this.reset();
	}

	public reset(): void {
		this.stratResolvers = {};
		this.registerStrategy(this.DEFAULT_STRAT_KEY, () => { return this.defStrat; } );
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

	public setPreferencesFor(key: string, props: Properties): void {
		requireNotNull(key, "key");
		const outStrat: OutputStrategy = this.getStrategy(key);
		outStrat.setPreferences(props);
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
		return (key.toLowerCase() !== this.DEFAULT_STRAT_KEY);
	}

	public getStrategy(key: string = this.DEFAULT_STRAT_KEY): OutputStrategy {
		const resolver: StrategyResolver = this.stratResolvers[key] || this.stratResolvers[this.DEFAULT_STRAT_KEY];
		return resolver();
	}
}

export default OutputStrategyProvider;
