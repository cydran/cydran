import COMPARE from "const/Compare";

test("compare strings", () => {
	const base: string = "start";
	const v1: string = "start";
	const v2: string = "end";

	expect(COMPARE.alpha(base, v1)).toEqual(0);
	expect(COMPARE.alpha(base, v2)).toEqual(1);
	expect(COMPARE.alpha(v2, v1)).toEqual(-1);
});
