import { builder, reset, Stage } from "cydran";

test("set production mode to true", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app", { "cydran.production.enabled": true, "cydran.logging.level": "WARN" }).build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(true);
});

test("expect default mode to be development (production mode == false)", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app", {"cydran.logging.level": "WARN"}).build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.production.enabled')).toEqual(false);
});
