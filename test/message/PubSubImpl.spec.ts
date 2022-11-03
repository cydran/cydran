import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Context from 'context/Context';
import PubSubImpl from 'message/PubSubImpl';
import PubSub from 'message/PubSub';
import RootContextImpl from 'context/RootContextImpl';

const context: Context = new RootContextImpl();

let specimen: PubSub = null;

beforeEach(() => {
	specimen = new PubSubImpl({}, context);
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

test("sendToContext() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.sendToContext(null, "messageName", "payload"));
});

test("sendToContext() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.sendToContext("channelName", null, "payload"));
});
test("sendToContext() - null payload", () => {
	assertNoErrorThrown(() => specimen.sendToContext("channelName", "messageName", null));
});

test("sendGlobally() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.sendGlobally(null, "messageName", "payload"));
});

test("sendGlobally() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.sendGlobally("channelName", null, "payload"));
});

test("sendGlobally() - null payload", () => {
	assertNoErrorThrown(() => specimen.sendGlobally("channelName", "messageName", null));
});

test("on() - null messageName", () => {
	assertNullGuarded("messageName", () => specimen.on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded("channelName", () => specimen.on("messageName").forChannel(null));
});

test("on().forChannel().invoke() - null callback", () => {
	assertNullGuarded("callback", () => specimen.on("messageName").forChannel("channelName").invoke(null));
});

test("on().invoke() - null callback", () => {
	assertNullGuarded("callback", () => specimen.on("messageName").invoke(null));
});

test("$dispose()", () => {
	const spySub: PubSub = spy(specimen);
	specimen.$dispose();
	verify(spySub.$dispose()).once();
});
