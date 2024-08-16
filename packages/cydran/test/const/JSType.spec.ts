import { JSType } from "Constants";

function doComp(expected: JSType, wkval: any): boolean {
	let retval = false;
	for(const k of Object.keys(JSType)) {
		const wkt: JSType = JSType[k];
		if(expected === wkt) {
			retval = wkt === typeof wkval;
		} else {
			retval = wkt !== typeof wkval;
		}
	}
	return retval;
}

test("type: string", () => {
	const val: string = "whatever";
	expect(doComp(JSType.STR, val)).toBe(true);
});

test("type: boolean", () => {
	const val: boolean = false;
	expect(doComp(JSType.BOOL, val)).toBe(true);
});

test("type: bigint", () => {
	const val: BigInt = BigInt(0);
	expect(doComp(JSType.BIGINT, val)).toBe(true);
});

test("type: number", () => {
	const val: number = -1;
	expect(doComp(JSType.NUM, val)).toBe(true);
});

test("type: symbol", () => {
	const val: Symbol = Symbol("y");
	expect(doComp(JSType.SYM, val)).toBe(true);
});

test("type: function", () => {
	const val: Function = () => { return true; };
	expect(doComp(JSType.FN, val)).toBe(true);
});

test("type: object", () => {
	const val: Object = {id: 0};
	expect(doComp(JSType.OBJ, val)).toBe(true);
});

test("type: undefined", () => {
	var val;
	expect(doComp(JSType.UND, val)).toBe(true);
});