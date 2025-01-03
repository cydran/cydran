import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLogStrategy';

class TraceLevelStrategyImpl extends AbstractLevelStrategy {

	public getLevel(): string {
		return Level.TRACE;
	}

}

export default TraceLevelStrategyImpl;
