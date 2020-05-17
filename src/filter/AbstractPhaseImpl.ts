import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";

abstract class AbstractPhaseImpl implements Phase {

	private previous: Phase;

	private callback: () => void;

	constructor(previous: Phase) {
		this.previous = requireNotNull(previous, "previous");
	}

	public process(items: any[]): any[] {
		const processed: any[] = this.previous.process(items);
		const result: any[] = this.execute(processed);

		return result;
	}

	public onChange(): void {
		this.callback();
	}

	public setCallback(callback: () => void): void {
		this.callback = callback;
		this.previous.setCallback(callback);
	}

	protected abstract execute(items: any[]): any[];

}

export default AbstractPhaseImpl;
