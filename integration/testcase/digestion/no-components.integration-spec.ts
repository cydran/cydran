import { builder, Ids, Stage } from 'cydran';

test("Digestion - No behaviors", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body", {"cydran.development.logging.level": "WARN"}).build();
	stage.start();

	expect(stage.isStarted()).toEqual(true);
	expect(stage.get(Ids.STAGE)).not.toBeNull();
});
