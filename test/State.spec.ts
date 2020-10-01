import { stateMachineBuilder, Machine, MachineContext } from "@/State";

interface Model {

	value: string;
	log: string[];

}

const predicate: (model: Model) => boolean = (model) => {
	model.value += "!";

	return true;
};

test("machine works", () => {


	const model: Model = {
		value: "FOO",
		log: []
	};

	const machine: Machine<Model> = stateMachineBuilder("EE")
		.withState("EE", [(modelInstance: Model) => modelInstance.log.push("Entered EE")])
		.withState("EO", [(modelInstance: Model) => modelInstance.log.push("Entered EO")])
		.withState("OE", [(modelInstance: Model) => modelInstance.log.push("Entered OE")])
		.withState("OO", [(modelInstance: Model) => modelInstance.log.push("Entered OO")])
		.withTransition("EE", "A", "OE", predicate, [(modelInstance: Model) => modelInstance.log.push("EE -> OE")])
		.withTransition("EE", "B", "EO", predicate, [(modelInstance: Model) => modelInstance.log.push("EE -> EO")])
		.withTransition("EO", "A", "OO", predicate, [(modelInstance: Model) => modelInstance.log.push("EO -> OO")])
		.withTransition("EO", "B", "EE", predicate, [(modelInstance: Model) => modelInstance.log.push("EO -> EE")])
		.withTransition("OE", "A", "EE", predicate, [(modelInstance: Model) => modelInstance.log.push("OE -> EE")])
		.withTransition("OE", "B", "OO", predicate, [(modelInstance: Model) => modelInstance.log.push("OE -> OO")])
		.withTransition("OO", "A", "EO", predicate, [(modelInstance: Model) => modelInstance.log.push("OO -> EO")])
		.withTransition("OO", "B", "OE", predicate, [(modelInstance: Model) => modelInstance.log.push("OO -> OE")])
		.build();

	const context: MachineContext<Model> = machine.create(model);
	expect(context.getState()).toEqual("EE");
	machine.evaluate("A", context);
	expect(context.getState()).toEqual("OE");
	machine.evaluate("A", context);
	expect(context.getState()).toEqual("EE");
	machine.evaluate("B", context);
	expect(context.getState()).toEqual("EO");
	machine.evaluate("A", context);
	expect(context.getState()).toEqual("OO");

	expect(model.value).toEqual("FOO!!!!");
	expect(model.log.length).toEqual(8);
	expect(model.log[0]).toEqual("EE -> OE");
	expect(model.log[1]).toEqual("Entered OE");
	expect(model.log[2]).toEqual("OE -> EE");
	expect(model.log[3]).toEqual("Entered EE");
	expect(model.log[4]).toEqual("EE -> EO");
	expect(model.log[5]).toEqual("Entered EO");
	expect(model.log[6]).toEqual("EO -> OO");
	expect(model.log[7]).toEqual("Entered OO");

	machine.$dispose();
});
