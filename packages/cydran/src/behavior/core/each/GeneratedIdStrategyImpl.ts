import IdStrategy from "behavior/core/each/IdStrategy";
import { asString } from "util/AsFunctions";
import { isDefined, uuidV4, requireNotNull } from 'util/Utils';

class GeneratedIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = requireNotNull(idKey, "idKey");
	}

	public check(item: any): boolean {
		return isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		item[this.idKey] = uuidV4();
	}

	public extract(item: any): string {
		return asString(item[this.idKey]);
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default GeneratedIdStrategyImpl;
