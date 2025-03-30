import { Component, Stage, create } from "@cydran/cydran";
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

function expectBodyToEqual(doc: Document, expected: string): void {
	const body: string = doc.body.innerHTML;
	expect(body).toEqual(expected);
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

	test("insertLeft - Single component", () => {
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	test("insertLeft - Multiple components", () => {
		specimen.getStage().before().insertLast(new TextComponent("Foo"));
		specimen.getStage().before().insertLast(new TextComponent("Bar"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><!--SE--><p>The body</p><!--SS--><!--SE-->");

		specimen.getStage().before().insertLast(new TextComponent("Baz"));
		specimen.getStage().before().insertLast(new TextComponent("Bat"));
		specimen.expectBody().toEqual("<!--SS--><p>Foo</p><p>Bar</p><p>Baz</p><p>Bat</p><!--SE--><p>The body</p><!--SS--><!--SE-->");
	});

	// TODO: 
	// getAt<N extends Nestable>(index: number): N;
	// replace(oldComponent: Nestable, newComponent: Nestable): void;
	// replaceAt(index: number, component: Nestable): void;
	// remove(component: Nestable): void;
	// removeAt(index: number): void;
	// insertBefore(index: number, component: Nestable): void;
	// insertAfter(index: number, component: Nestable): void;
	// insertFirst(component: Nestable): void;
	// hasComponents(): boolean;
	// contains(component: Nestable): boolean;
	// isEmpty(): boolean;
	// clear(): void;

});
