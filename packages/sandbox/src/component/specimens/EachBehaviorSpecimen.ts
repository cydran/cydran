import { Component } from "@cydran/cydran";
import TEMPLATE from "./EachBehaviorSpecimen.html";

interface EachItem {
	id: number;
	label: string;
	special: boolean;
}

/**
 * Specimen: `c-each` list rendering. Array mutations happen in click handlers (so the
 * post-invoke digest picks up the in-place changes) to exercise reconciliation:
 * add/remove/reorder, the empty/first/last slots, and alt-vs-item selection via `c-test`.
 * Keyed by `v().id` (expression id strategy).
 */
class EachBehaviorSpecimen extends Component {

	private items: EachItem[];

	private nextId: number;

	constructor() {
		super(TEMPLATE);
		this.items = [];
		this.nextId = 0;
	}

	private make(special: boolean): EachItem {
		this.nextId = this.nextId + 1;
		return { id: this.nextId, label: "Item " + this.nextId, special };
	}

	public addLast(): void {
		this.items.push(this.make(false));
	}

	public addFirst(): void {
		this.items.unshift(this.make(false));
	}

	public addSpecialLast(): void {
		this.items.push(this.make(true));
	}

	public removeFirst(): void {
		if (this.items.length > 0) {
			this.items.shift();
		}
	}

	public removeLast(): void {
		if (this.items.length > 0) {
			this.items.pop();
		}
	}

	public moveFirstToLast(): void {
		if (this.items.length > 1) {
			this.items.push(this.items.shift());
		}
	}

	public toggleSpecialFirst(): void {
		if (this.items.length > 0) {
			this.items[0].special = !this.items[0].special;
		}
	}

	public clearAll(): void {
		this.items = [];
	}

}

export default EachBehaviorSpecimen;
