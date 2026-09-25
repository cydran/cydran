import { Component } from "@cydran/cydran";
import TEMPLATE from "./EachItemValuesSpecimen.html";

interface Row {
	name: string;
	qty: number;
	color: string;
	done: boolean;
	key?: number;
}

/**
 * Specimen: `v()` inside `c-each` items across binding contexts (text, attribute, c-class, c-if,
 * c-hidden, c-model on text/number/select, c-checked, c-onclick) and update patterns (in-place edit,
 * same-key replacement, reorder, add, remove). Two lists over equivalent data: `genRows` uses the
 * default `generated` id mode (rows start with no `id`, so ids are generated onto the objects) and
 * `exprRows` uses `expression` mode keyed by `v().key`. Every control applies to both lists. Parent
 * mirrors expose the model so tests can tell a DOM problem from a model problem.
 */
class EachItemValuesSpecimen extends Component {

	private genRows: Row[];

	private exprRows: Row[];

	private nextKey: number;

	private selected: string;

	constructor() {
		super(TEMPLATE);
		this.genRows = EachItemValuesSpecimen.seed(false);
		this.exprRows = EachItemValuesSpecimen.seed(true);
		this.nextKey = 4;
		this.selected = "none";
	}

	private static seed(keyed: boolean): Row[] {
		const rows: Row[] = [
			{ name: "alpha", qty: 1, color: "red", done: false },
			{ name: "beta", qty: 2, color: "green", done: true },
			{ name: "gamma", qty: 3, color: "blue", done: false }
		];

		if (keyed) {
			rows.forEach((row: Row, index: number) => row.key = index + 1);
		}

		return rows;
	}

	public select(row: Row): void {
		this.selected = row.name;
	}

	public editFirstInPlace(): void {
		for (const rows of [this.genRows, this.exprRows]) {
			if (rows.length > 0) {
				rows[0].name = rows[0].name + "*";
				rows[0].done = !rows[0].done;
			}
		}
	}

	public replaceAllSameKey(): void {
		this.genRows = this.genRows.map((row: Row) => ({ ...row, name: row.name + "+" }));
		this.exprRows = this.exprRows.map((row: Row) => ({ ...row, name: row.name + "+" }));
	}

	public replaceFirstSameKey(): void {
		for (const rows of [this.genRows, this.exprRows]) {
			if (rows.length > 0) {
				rows[0] = { ...rows[0], name: rows[0].name + "#", done: !rows[0].done };
			}
		}
	}

	public reverse(): void {
		this.genRows.reverse();
		this.exprRows.reverse();
	}

	public add(): void {
		const key: number = this.nextKey;
		this.nextKey = this.nextKey + 1;
		this.genRows.push({ name: "row" + key, qty: key, color: "red", done: false });
		this.exprRows.push({ name: "row" + key, qty: key, color: "red", done: false, key: key });
	}

	public removeFirst(): void {
		this.genRows.shift();
		this.exprRows.shift();
	}

	public summary(rows: Row[]): string {
		return rows.map((row: Row) => `${ row.name }|${ row.qty }|${ row.color }|${ row.done }`).join(",");
	}

}

export default EachItemValuesSpecimen;
