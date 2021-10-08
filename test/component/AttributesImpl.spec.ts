import { mock, spy, verify } from "ts-mockito";
import AttributesImpl from "component/AttributesImpl";

const SPECIMEN: AttributesImpl = new AttributesImpl("c");

test("AttributesImpl constructor - populated prefix", () => {
	expect(SPECIMEN).not.toBeNull();
});

test("AttributesImpl constructor - null prefix", () => {
	let thrown = null;
	try {
		new AttributesImpl(null);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("prefix shall not be null");
});

test("AttributesImpl extract()", () => {
	const element: HTMLElement = document.createElement("div");
	element.setAttribute("c:first", "one");

	expect(element.hasAttribute("c:first")).toBeTruthy();
	expect(element.getAttribute("c:first")).toEqual("one");

	expect(SPECIMEN.extract(element, "first")).toEqual("one");
});

test("AttributesImpl remove()", () => {
	const element: HTMLElement = document.createElement("div");
	element.setAttribute("c:first", "one");
	element.setAttribute("c:second", "two");
	element.setAttribute("c:third", "three");

	expect(element.hasAttribute("c:first")).toBeTruthy();
	expect(element.hasAttribute("c:second")).toBeTruthy();
	expect(element.hasAttribute("c:third")).toBeTruthy();
	expect(element.getAttribute("c:first")).toEqual("one");
	expect(element.getAttribute("c:second")).toEqual("two");
	expect(element.getAttribute("c:third")).toEqual("three");

	SPECIMEN.remove(element, "second");

	expect(element.hasAttribute("c:first")).toBeTruthy();
	expect(element.hasAttribute("c:second")).toBeFalsy();
	expect(element.hasAttribute("c:third")).toBeTruthy();
	expect(element.getAttribute("c:first")).toEqual("one");
	expect(element.getAttribute("c:third")).toEqual("three");
});

test("AttributesImpl isEventAttribute() - with event attribute", () => {
	expect(SPECIMEN.isEventAttribute("c:onclick")).toBeTruthy();
});

test("AttributesImpl isEventAttribute() - with malformed event Cydran attribute", () => {
	expect(SPECIMEN.isEventAttribute("c:onbogus:event")).toBeFalsy();
});

test("AttributesImpl isEventAttribute() - with non-event Cydran attribute", () => {
	expect(SPECIMEN.isEventAttribute("c:foo")).toBeFalsy();
});

test("AttributesImpl isEventAttribute() - with non-event Cydran attribute", () => {
	expect(SPECIMEN.isEventAttribute("class")).toBeFalsy();
});

// TODO - Exclude behavior params attributes from truthiness

test("AttributesImpl isBehaviorAttribute() - valid behavior attribute", () => {
	expect(SPECIMEN.isBehaviorAttribute("c:foo")).toBeTruthy();
});

test("AttributesImpl isBehaviorAttribute() - behavior param attribute", () => {
	expect(SPECIMEN.isBehaviorAttribute("c:foo:bar")).toBeFalsy();
});

test("AttributesImpl isBehaviorAttribute() - non-behavior attribute", () => {
	expect(SPECIMEN.isBehaviorAttribute("class")).toBeFalsy();
});

test("AttributesImpl extractEventName()", () => {
	expect(SPECIMEN.extractEventName("c:onclick")).toEqual("click");
});

test("AttributesImpl extractBehaviorName()", () => {
	expect(SPECIMEN.extractBehaviorName("c:bar")).toEqual("bar");
});

test("AttributesImpl asTypePrefix()", () => {
	expect(SPECIMEN.asTypePrefix("bar")).toEqual("c:bar");
});

test("AttributesImpl getPrefix()", () => {
	expect(SPECIMEN.getPrefix()).toEqual("c");
});
