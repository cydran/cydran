import { OutputStrategy } from 'log/OutputStrategy';
import OutputStrategyResolver from 'argument/OutputStrategyResolver';
import LoggerFactory from 'log/LoggerFactory';

class TestOutStrat implements OutputStrategy {
  public getId(): string {
    return "testout";
  }

  public setPreferences(props: Properties): void {
    // no-op
  }

  public setTag(tag: string): void {
    // no-op
  }

  public setTagVisibility(visible: boolean): void {
    // no-op
  }
}

let osr: OutputStrategyResolver;
let tos: TestOutStrat;

beforeAll(() => {
  LoggerFactory.init();
  tos = new TestOutStrat();
})

beforeEach(() => {
  osr = new OutputStrategyResolver(tos.getId(), tos);
});

afterEach(() => {
  osr = null;
});

test("OutputStrategyResolver is not null", () => {
  expect(osr).not.toBe(null);
});

test("resolve(ctxt)", () => {
  const wkSpy: OutputStrategyResolver = jest.spyOn(osr, "resolve");
  const ctxt = {id: "buzzkill"};
  osr.resolve(ctxt);
  expect(wkSpy).toHaveBeenCalledWith(ctxt);
});

test("postProcess()", () => {
  const wkSpy: OutputStrategyResolver = jest.spyOn(osr, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  osr.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});