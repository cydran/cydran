import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class TraceLevelStrategyImpl extends AbstractLevelStrategy {

	public isTrace(): boolean {
		return true;
	}

	public isDebug(): boolean {
		return true;
	}

	public isInfo(): boolean {
		return true;
	}

	public isWarn(): boolean {
		return true;
	}

	public isError(): boolean {
		return true;
	}

	public isFatal(): boolean {
		return true;
	}

	public getLevel(): string {
		return Level.TRACE;
	}

}

export default TraceLevelStrategyImpl;
