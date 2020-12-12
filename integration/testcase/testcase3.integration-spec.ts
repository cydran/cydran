import { builder, Ids } from "Component";
import { Stage } from "Interfaces";

test("Digestion - No element mediators", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body")
		.withWarnLogging()
		.build();

	stage.start();

	expect(stage.isStarted()).toEqual(true);
	expect(stage.get(Ids.STAGE)).not.toBeNull();
});
