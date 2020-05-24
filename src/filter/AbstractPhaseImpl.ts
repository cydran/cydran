import { requireNotNull, isDefined, equals, clone } from "@/util/ObjectUtils";
import { Phase } from "@/filter/Interfaces";
import { NO_OP_FN } from "@/constant/Constants";

abstract class AbstractPhaseImpl implements Phase {

	private previous: Phase;

	private memo: any[];

	private callback: () => void;

	constructor(previous: Phase) {
		this.previous = requireNotNull(previous, "previous");
		this.memo = null;
		this.callback = NO_OP_FN;
	}

	public process(items: any[]): any[] {
		const processed: any[] = this.previous.process(items);

		if (!isDefined(processed) || equals(processed, this.memo)) {
			return null;
		}

		this.memo = clone(processed);

		return this.execute(processed);
	}

	public onChange(): void {
		this.memo = null;
		this.callback();
	}

	public setCallback(callback: () => void): void {
		this.callback = callback;
		this.previous.setCallback(callback);
	}

	protected abstract execute(items: any[]): any[];

}

export default AbstractPhaseImpl;
