import { createMachineBuilder, Machine, MachineContext } from "@/State";

interface Model {

	value: string;

}

const predicate: (model: Model) => boolean = (model) => {
	model.value += "!";

	return true;
};

test("machine works", () => {

	const model: Model = {
		value: "FOO"
	};

	const machine: Machine<Model> = createMachineBuilder("EE")
		.withState("EE")
		.withState("EO")
		.withState("OE")
		.withState("OO")
		.withTransition("EE", "A", "OE", predicate)
		.withTransition("EE", "B", "EO", predicate)
		.withTransition("EO", "A", "OO", predicate)
		.withTransition("EO", "B", "EE", predicate)
		.withTransition("OE", "A", "EE", predicate)
		.withTransition("OE", "B", "OO", predicate)
		.withTransition("OO", "A", "EO", predicate)
		.withTransition("OO", "B", "OE", predicate)
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

	machine.$dispose();
});
