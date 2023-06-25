import OutputStrategy from 'log/OutputStrategy';
import OutputStrategyResolver from 'argument/OutputStrategyResolver';

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

let osr: OutputStrategyResolver = null;
let tos: TestOutStrat = null;

beforeAll(() => {
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