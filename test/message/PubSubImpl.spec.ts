import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Module from 'module/Module';
import PubSubImpl from 'message/PubSubImpl';
import PubSub from 'message/PubSub';
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

const cydranContext: CydranContext = new CydranContextImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();

let specimen: PubSub = null;
beforeEach(() => {
	specimen = new PubSubImpl({}, module);
});

afterEach(() => {
	specimen = null;
});

test("message() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.message(null, "messageName", "payload"));
});

test("message() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.message("channelName", null, "payload"));
});

test("message() - null payload", () => {
	assertNoErrorThrown(() => specimen.message("channelName", "messageName", null));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.broadcast(null, "messageName", "payload"));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.broadcast("channelName", null, "payload"));
});

test("broadcast() - null payload", () => {
	assertNoErrorThrown(() => specimen.broadcast("channelName", "messageName", null));
});

test("broadcastGlobally() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.broadcastGlobally(null, "messageName", "payload"));
});

test("broadcastGlobally() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.broadcastGlobally("channelName", null, "payload"));
});

test("broadcastGlobally() - null payload", () => {
	assertNoErrorThrown(() => specimen.broadcastGlobally("channelName", "messageName", null));
});

test("on() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.on("messageName").forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => specimen.on("messageName").forChannel("channelName").invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => specimen.on("messageName").invoke(null));
});

test("enableGlobal()", () => {
	const spySub: PubSub = spy(specimen);
	specimen.enableGlobal();
	verify(spySub.enableGlobal()).once();
});

test("isGlobalEnabled()", () => {
	specimen.enableGlobal();
	expect(specimen.isGlobalEnabled()).toBe(true);
	specimen.disableGlobal();
	expect(specimen.isGlobalEnabled()).toBe(false);
});

test("disableGlobal()", () => {
	const spySub: PubSub = spy(specimen);
	specimen.enableGlobal();
	verify(spySub.enableGlobal()).once();
	expect(specimen.isGlobalEnabled()).toBe(true);
	specimen.disableGlobal();
	verify(spySub.disableGlobal()).once();
	expect(specimen.isGlobalEnabled()).toBe(false);
});

test("$dispose()", () => {
	const spySub: PubSub = spy(specimen);
	specimen.$dispose();
	verify(spySub.$dispose()).once();
});

test("listenTo(channel, messageName, target)", () => {
	const spySub: PubSub = spy(specimen);
	const msgName: string = "first";
	const argList: any[] = ["OWN", "first", () => {return `${msgName}`;}];
	specimen.listenTo(argList);
	verify(spySub.listenTo(argList)).once();
});
