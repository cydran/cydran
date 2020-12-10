import { mock, spy, verify } from "ts-mockito";
import Messages from "util/Messages";

test("Messages constructor", () => {
	const specimen: Messages = new Messages();
	expect(specimen).not.toBeNull();
});

test("Messages getMessages()", () => {
	const specimen: Messages = new Messages();

	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");

	const result: string = specimen.getMessages();

	expect(result).toEqual(`Errors:
	- first error
	- second error
	- third error
`);
});

test("Messages hasMessages - with messages()", () => {
	const specimen: Messages = new Messages();
	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");

	expect(specimen.hasMessages()).toBeTruthy();
});

test("Messages hasMessages() - without messages", () => {
	const specimen: Messages = new Messages();
	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");
	specimen.clear();

	expect(specimen.hasMessages()).toBeFalsy();
});

test("Messages hasMessages() - with messages never added", () => {
	const specimen: Messages = new Messages();

	expect(specimen.hasMessages()).toBeFalsy();
});

test("Messages getMessages() - with messages", () => {
	const specimen: Messages = new Messages();

	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");

	const result: string[] = [];
	specimen.ifMessages((message) => result.push(message));

	expect(result[0]).toEqual(`Errors:
	- first error
	- second error
	- third error
`);
});

test("Messages getMessages() - without messages", () => {
	const specimen: Messages = new Messages();
	specimen.add("first error");
	specimen.add("second error");
	specimen.add("third error");
	specimen.clear();

	let result: boolean = false;
	specimen.ifMessages((message) => result = true);

	expect(result).toBeFalsy();
});

test("Messages getMessages() - without messages never added", () => {
	const specimen: Messages = new Messages();

	let result: boolean = false;
	specimen.ifMessages((message) => result = true);

	expect(result).toBeFalsy();
});

test("Messages addIf()", () => {
	const specimen: Messages = new Messages();
	specimen.addIf(true, () => "first error");
	specimen.addIf(false, () => "second error");
	specimen.addIf(true, () => "third error");

	expect(specimen.getMessages()).toEqual(`Errors:
	- first error
	- third error
`);
});
