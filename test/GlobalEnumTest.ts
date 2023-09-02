class GlobalEnumTest {

  constructor() {
    //
  }

  public test(oType: any, values: string[]): void {
    describe(`Expected constants of ${oType[name]}`, () => {
      test.each(values)(`availability of state: '%s'`, (val) => {
        try {
          const wkObj: any = oType[val];
          expect(wkObj).not.toBeNull();
          expect(wkObj).toBe(val);
        } catch (err) {
          throw err;
        }
      });

      const badVal: string = "Whack";
      test(`failure with bad value: '${badVal}'`, () => {
        expect(oType[badVal]).toBe(undefined);
      });

    });
  }
}

export default GlobalEnumTest;

