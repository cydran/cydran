import { StageImpl } from "context/RootContextImpl";
import { UnknownContextError, NamingConflictError } from "error/Errors";
import Stage from "stage/Stage";
import Component from "component/Component";

const ROOT_TEMPLATE: string = "<div></div>";
class TestComponent extends Component {

	private barCount: number;

	private bazCount: number;

	constructor() {
		super(ROOT_TEMPLATE);
		this.barCount = 0;
		this.bazCount = 0;
		this.$c().onMessage("bar").forChannel("foo").invoke(this.onBar);
		this.$c().onMessage("baz").forChannel("foo").invoke(this.onBaz);
	}

	public onBar(): void {
		this.barCount++;
	}

	public onBaz(): void {
		this.bazCount++;
	}

	public getBarCount(): number {
		return this.barCount;
	}

	public getBazCount(): number {
		return this.bazCount;
	}
}

const b: string = "boo" as const;

class WorkObj {
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	doWork() {
		console.log(`wkObj.id: ${ this.id }`);
	}
}

const CHAN: string = "ABC" as const;
const MNAME: string = "sing" as const;
const PAYLOAD: {id: string} = {id: CHAN};

const wkSel: string = "body" as const;
let specimen: StageImpl;

beforeEach(() => {
	specimen = new StageImpl(wkSel, {"cydran.logging.level": "WARN", "cydran.startup.synchronous": true});
});

afterEach(() => {
	specimen = null;
});

test("not null instantiation", () => {
	expect(specimen).not.toBe(null);
});

test("sendToParentContext", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendToParentContext");
	specimen.sendToParentContext(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("sendToParentContexts", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendToParentContexts");
	specimen.sendToParentContexts(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("sendToRoot", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendToRoot");
	specimen.sendToRoot(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("sendToChildContexts", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendToChildContexts");
	specimen.sendToChildContexts(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("sendToDescendantContexts", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendToDescendantContexts");
	specimen.sendToDescendantContexts(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("sendGlobally", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "sendGlobally");
	specimen.sendGlobally(CHAN, MNAME, PAYLOAD);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN, MNAME, PAYLOAD);
});

test("getChild", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "getChild");
	const result: {} = specimen.getChild(CHAN);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN);
	expect(result).toBe(null);
});

test("hasChild", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "hasChild");
	const result: boolean = specimen.hasChild(CHAN);
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(wkSpy).toHaveBeenCalledWith(CHAN);
	expect(result).toBe(false);
});

test("addChild", () => {
	const wkObj: WorkObj = new WorkObj(b);
	const wkSpy: StageImpl = jest.spyOn(specimen, "addChild");
	const expected = (wkObj) => wkObj.doWork;
	const result = specimen.addChild(CHAN, expected);
	expect(wkSpy).toBeCalledTimes(1);
	expect(result).toEqual(result);
	expect(() => specimen.addChild(CHAN, expected)).toThrowError(NamingConflictError);
});

test("removeChild", () => {
	const wkObj: WorkObj = new WorkObj(b);
	const wkSpy: StageImpl = jest.spyOn(specimen, "removeChild");
	const expected = (wkObj) => wkObj.doWork;
	const result = specimen.addChild(CHAN, expected);
	expect(result).toEqual(result);
	specimen.removeChild(CHAN);
	expect(wkSpy).toBeCalledTimes(1);
	expect(specimen.hasChild()).toBe(false);
	expect(() => specimen.removeChild("XYZ")).toThrowError(UnknownContextError);
});

test("runPreInitializers", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "runPreInitializers");
	specimen.runPreInitializers();
	expect(wkSpy).toBeCalledTimes(1);
});

test("runInitializers", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "runInitializers");
	specimen.runInitializers();
	expect(wkSpy).toBeCalledTimes(1);
});

test("removeMessageCallback", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "removeMessageCallback");
	const wkFn = (CHAN, MNAME, PAYLOAD) => {};
	specimen.removeMessageCallback(wkFn);
	expect(wkSpy).toBeCalledTimes(1);
});

test("registerImplicit", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "registerImplicit");
	const template: string = "<div></div>";
	specimen.registerImplicit(CHAN, template);
	expect(wkSpy).toBeCalledTimes(1);
});

test("tell: addMessageCallback", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "tell");
	const cb: string = "addMessageCallback";
	specimen.tell(cb);
	expect(wkSpy).toBeCalledTimes(1);
});

test("tell: removeMessageCallback", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "tell");
	const cb: string = "removeMessageCallback";
	specimen.tell(cb);
	expect(wkSpy).toBeCalledTimes(1);
});

test.skip("addComponentBefore", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "addComponentBefore");
	specimen.addComponentBefore(TestComponent.name, TestComponent);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test.skip("addComponentAfter", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "addComponentAfter");
	specimen.addComponentAfter(TestComponent.name, TestComponent);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});

test.skip("setComponent", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "setComponent");
	const s: Stage = specimen.setComponent(TestComponent.name, new TestComponent());
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(s).not.toBe(null);
});

test("isStarted", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "isStarted");
	const started: boolean = specimen.isStarted();
	expect(wkSpy).toHaveBeenCalledTimes(1);
	expect(started).toBe(false);
});

test("$dispose", () => {
	const wkSpy: StageImpl = jest.spyOn(specimen, "$dispose");
	specimen.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});