import { Component } from "@cydran/cydran";
import { beforeEach, describe, expect, test } from '@jest/globals';
import { Harness } from '@cydran/testsupport';

class BodyComponent extends Component {

	constructor() {
		super("<p>The body</p>");
	}

}

class TextComponent extends Component {

	constructor(text: string) {
		super("<p>" + text + "</p>");
	}

}

describe("Series", () => {

	let specimen: Harness<BodyComponent> = null as unknown as Harness<BodyComponent>;

	beforeEach(async () => {
		specimen = new Harness<BodyComponent>(() => new BodyComponent());
		specimen.start();	
	});		

	test("Empty Series", () => {
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("insertLast - Single component", () => {
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("insertLast - Multiple components", () => {
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.getStage().before().insertLast(new TextComponent("Bar"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		specimen.getStage().before().insertLast(new TextComponent("Baz"));
		specimen.getStage().before().insertLast(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("clear - full to empty", () => {
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.getStage().before().insertLast(new TextComponent("Bar"));
		specimen.getStage().before().insertLast(new TextComponent("Baz"));
		specimen.getStage().before().insertLast(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		specimen.getStage().before().clear();
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("isEmpty - present and absent cases", () => {
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.getStage().before().insertLast(new TextComponent("Bar"));
		specimen.getStage().before().insertLast(new TextComponent("Baz"));
		specimen.getStage().before().insertLast(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		expect(specimen.getStage().before().isEmpty()).toEqual(false);

		specimen.getStage().before().clear();
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		expect(specimen.getStage().before().isEmpty()).toEqual(true);
	});

	test("hasComponents - present and absent cases", () => {
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.getStage().before().insertLast(new TextComponent("Bar"));
		specimen.getStage().before().insertLast(new TextComponent("Baz"));
		specimen.getStage().before().insertLast(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		expect(specimen.getStage().before().hasComponents()).toEqual(true);

		specimen.getStage().before().clear();
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		expect(specimen.getStage().before().hasComponents()).toEqual(false);
	});

	test("getAt - present and absent cases", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Expected values that should be there
		expect(specimen.getStage().before().getAt(0)).toStrictEqual(first);
		expect(specimen.getStage().before().getAt(1)).toStrictEqual(second);
		expect(specimen.getStage().before().getAt(2)).toStrictEqual(third);
		expect(specimen.getStage().before().getAt(3)).toStrictEqual(fourth);

		// Values out of range
		expect(() => specimen.getStage().before().getAt(-1)).toThrowError("Index -1 is out of bounds for series with length 4");
		expect(() => specimen.getStage().before().getAt(31337)).toThrowError("Index 31337 is out of bounds for series with length 4");
	});

	test("remove - iterative removal", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().remove(second);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().remove(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().remove(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().remove(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().remove(first);
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("removeAt - Remove existing components", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().removeAt(1);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().removeAt(2);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().removeAt(1);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().removeAt(0);
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("removeAt - Out of rage above", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		expect(() => specimen.getStage().before().removeAt(-1)).toThrowError("Index -1 is out of bounds for series with length 4");

		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("removeAt - Out of rage below", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
		expect(() => specimen.getStage().before().removeAt(10)).toThrowError("Index 10 is out of bounds for series with length 4");
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("contains - present and absent cases", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		expect(specimen.getStage().before().contains(first)).toEqual(true);
		expect(specimen.getStage().before().contains(second)).toEqual(true);
		expect(specimen.getStage().before().contains(third)).toEqual(false);
		expect(specimen.getStage().before().contains(fourth)).toEqual(true);		
	});

	test("insertFirst - Single component", () => {
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().insertFirst(new TextComponent("Foo"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("insertFirst - Multiple components", () => {
		specimen.expectBody().toEqual("<!--SS--><!--SE--><p>The body</p><!--SS--><!--SE-->");
		specimen.getStage().before().insertFirst(new TextComponent("Foo"));
		specimen.getStage().before().insertFirst(new TextComponent("Bar"));
		specimen.expectBody().toEqual("<!--SS--><p>Bar</p><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		specimen.getStage().before().insertFirst(new TextComponent("Baz"));
		specimen.getStage().before().insertFirst(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Bat</p><p>Baz</p><p>Bar</p><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("replace - existing component", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		// Initial state
		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace middle
		specimen.getStage().before().replace(second, fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bat</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace first
		specimen.getStage().before().replace(first, second);
		specimen.expectBody().toEqual("<!--SS--><p>Bar</p><p>Bat</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace last
		specimen.getStage().before().replace(third, first);
		specimen.expectBody().toEqual("<!--SS--><p>Bar</p><p>Bat</p><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("replace - non-existing component", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		specimen.getStage().before().replace(second, fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("replaceAt - out of range component, above", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		expect(() => specimen.getStage().before().replaceAt(-5, fourth)).toThrowError("Index -5 is out of bounds for series with length 3");
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("replaceAt - out of range component, below", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		expect(() => specimen.getStage().before().replaceAt(10, fourth)).toThrowError("Index 10 is out of bounds for series with length 3");
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("replaceAt - existing component", () => {
		const first: Component = new TextComponent("Foo");
		const second: Component = new TextComponent("Bar");
		const third: Component = new TextComponent("Baz");
		const fourth: Component = new TextComponent("Bat");

		// Initial state
		specimen.getStage().before().insertLast(first);
		specimen.getStage().before().insertLast(second);
		specimen.getStage().before().insertLast(third);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace middle
		specimen.getStage().before().replaceAt(1, fourth);
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bat</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace first
		specimen.getStage().before().replaceAt(0, second);
		specimen.expectBody().toEqual("<!--SS--><p>Bar</p><p>Bat</p><p>Baz</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		// Replace last
		specimen.getStage().before().replaceAt(2, first);
		specimen.expectBody().toEqual("<!--SS--><p>Bar</p><p>Bat</p><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});


	// TODO: 
	// 
	// insertBefore - Existing index, out of range index before, out of range index after
	// insertAfter - Existing index, out of range index before, out of range index after

	// TODO - Check null guarding of all input

});
