import IdStrategy from "behavior/core/each/IdStrategy";
import { asString } from "util/AsFunctions";
import { isDefined, uuidV4, requireNotNull } from 'util/Utils';

class GeneratedIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = requireNotNull(idKey, "idKey");
	}

	public check(item: unknown): boolean {
		return isDefined(item[this.idKey]);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public enrich(item: unknown, index: number): void {
		item[this.idKey] = uuidV4();
	}

	public extract(item: unknown): string {
		return asString(item[this.idKey]);
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default GeneratedIdStrategyImpl;
