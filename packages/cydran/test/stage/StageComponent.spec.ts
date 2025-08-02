import StageComponent from "stage/StageComponent";
import { describe, expect, test } from '@jest/globals';
import GlobalContextImpl from "context/GlobalContextImpl";

expect(GlobalContextImpl).not.toBeNull();

describe("StageComponent", () => {

	test("instantiation and whole", () => {
		const specimen: StageComponent = new StageComponent("<div></div>");
		expect(specimen).not.toBeNull();
	});

});