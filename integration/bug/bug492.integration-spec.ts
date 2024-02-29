import { Stage, StageImpl } from 'cydran';

test("set production mode to true", () => {
	document.body.innerHTML = '<div id="app"></div>';
	const stage: Stage = new StageImpl("#app", { "cydran.strict.enabled": true, "cydran.logging.level": "WARN" });
	stage.start();

	expect(stage.getContext().getProperties().isTruthy('cydran.strict.enabled')).toEqual(true);
});

test("expect default mode to be strict (strict mode == false)", () => {
	document.body.innerHTML = '<div id="app"></div>';
	const stage: Stage = new StageImpl("#app", {"cydran.logging.level": "WARN"});
	stage.start();


	expect(stage.getContext().getProperties().isTruthy('cydran.strict.enabled')).toEqual(true);
});
