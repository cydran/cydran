import IdStrategy from "strat/IdStrategy";
import { isDefined, uuidV4 } from "util/Utils";

class GeneratedIdStrategyImpl implements IdStrategy {
	private idKey: string;

	constructor(idKey: string) {
		this.idKey = idKey;
	}

	public check(item: any): boolean {
		return isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		item[this.idKey] = uuidV4();
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}
}

export default GeneratedIdStrategyImpl;
