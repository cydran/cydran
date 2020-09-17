import { createMachineBuilder, Machine, MachineContext } from "@/State";

interface Model {

	value: string;

}

test("machine works", () => {

	const model: Model = {
		value: "foo"
	};

	const machine: Machine<Model> = createMachineBuilder("EE")
		.withState("EE")
		.withState("EO")
		.withState("OE")
		.withState("OO")
		.withTransition("EE", "A", "OE", () => true)
		.withTransition("EE", "B", "EO", () => true)
		.withTransition("EO", "A", "OO", () => true)
		.withTransition("EO", "B", "EE", () => true)
		.withTransition("OE", "A", "EE", () => true)
		.withTransition("OE", "B", "OO", () => true)
		.withTransition("OO", "A", "EO", () => true)
		.withTransition("OO", "B", "OE", () => true)
		.build();

	const context: MachineContext<Model> = machine.create(model);

	expect(context.getState()).toEqual("EE");

});
