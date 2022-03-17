import { builder, reset, Stage } from "cydran";

test("set production mode to true", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app", { "cydran.strict.enabled": false, "cydran.logging.level": "WARN" }).build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.strict.enabled')).toEqual(false);
});

test("expect default mode to be strict (strict mode == false)", () => {
	reset();

	document.body.innerHTML = '<div id="app"></div>';

	const stage: Stage = builder("#app", {"cydran.logging.level": "WARN"}).build();
	stage.start();

	expect(stage.getProperties().isTruthy('cydran.strict.enabled')).toEqual(false);
});
