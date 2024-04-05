import { Ids, Stage, StageImpl } from "@cydran/cydran";

test.skip("Digestion - No behaviors", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = new StageImpl("body", {"cydran.logging.level": "WARN"});
	stage.start();

	expect(stage.isStarted()).toEqual(true);
	expect(stage.getObject(Ids.STAGE)).not.toBeNull();
});
