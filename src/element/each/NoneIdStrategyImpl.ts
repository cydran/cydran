import IdStrategy from "@/element/repeat/IdStrategy";
import { isDefined } from "@/util/ObjectUtils";

class NoneIdStrategyImpl implements IdStrategy {

	private idKey: string;

	constructor(idKey: string) {
		this.idKey = idKey;
	}

	public check(item: any): boolean {
		return isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		throw new Error("Missing id in field " + this.idKey + " for item at index " + index
			+ ".  All repeat items must include a string convertable id to be repeated.");
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default NoneIdStrategyImpl;
