import StageComponent from "stage/StageComponent";
import { describe, expect, test } from '@jest/globals';
import GlobalContextImpl from "context/GlobalContextImpl";
import Renderer from 'component/Renderer';
import StageRendererImpl from 'component/renderer/StageRendererImpl';

expect(GlobalContextImpl).not.toBeNull();

describe("StageComponent", () => {

	test("instantiation and whole", () => {
		const renderer: Renderer = new StageRendererImpl("body");
		const specimen: StageComponent = new StageComponent(renderer);
		expect(specimen).not.toBeNull();
	});

});