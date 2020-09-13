import { builder, Component } from 'cydran';

test("set production mode to true", () => {
	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app")
		.withProperties({
			"cydran.production.enabled": true
		})
		.build();
	stage.start();
	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(true);
});

test("expect default mode to be development (production mode == false)", () => {
	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app")
		.build();
	stage.start();
	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(false);
});
