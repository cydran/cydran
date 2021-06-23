/**
 * @jest-environment jsdom
 */
import { builder, reset, Stage } from "cydran";

test.skip("set production mode to true", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app")
		.withProperties({
			"cydran.production.enabled": true
		})
		.build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(true);
});

test.skip("expect default mode to be development (production mode == false)", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app")
		.build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(false);
});
