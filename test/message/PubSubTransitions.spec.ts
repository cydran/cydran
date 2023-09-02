import PubSubTransitions from "message/PubSubTransitions";

const spec: Object = PubSubTransitions;
const oName: string = "PubSubTransitions";

describe(`Expected constants of ${ oName }`, () => {
	const enumStates: string[] = Object.keys(spec).map(k => { return spec[k]; });

	test.each(enumStates)(`${ oName } availability of state for: '%s'`, (val) => {
		try {
			const wkVal: string = val.toUpperCase();
			const wkObj: any = spec[wkVal];
			expect(wkObj).not.toBeNull();
			expect(wkObj).toEqual(val);
		} catch (err) {
			throw err;
		}
	});

	const badVal: string = "Whack";
	test(`failure with bad value: '${badVal}'`, () => {
		expect(spec[badVal]).toBeUndefined();
	});

});