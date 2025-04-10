import { create, Stage } from "@cydran/cydran";
import { describe, test, expect } from '@jest/globals';

describe("Digestion - No components", () => {

	test("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';

		const stage: Stage = create("body", { "cydran.logging.level": "WARN" });
		stage.start();

		expect(stage.isStarted()).toEqual(true);
		expect(stage.getContext().getObject("cydranStage")).not.toBeNull();
	});

});
