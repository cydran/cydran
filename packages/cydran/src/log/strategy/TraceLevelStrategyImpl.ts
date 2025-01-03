import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class TraceLevelStrategyImpl extends AbstractLevelStrategy {

	public getLevel(): string {
		return Level.TRACE;
	}

}

export default TraceLevelStrategyImpl;
