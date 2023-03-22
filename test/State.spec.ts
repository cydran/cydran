import Machine from 'machine/Machine';
import stateMachineBuilder from 'machine/StateMachineBuilder';
import MachineState from 'machine/MachineState';

interface Model {

	value: string;
	log: string[];

}

const predicate: (parmeter: any, model: Model) => boolean = (parmeter, model) => {
	model.value += "!";

	return true;
};

test("machine works", () => {
	const model: Model = {
		value: "FOO",
		log: []
	};

	const machine: Machine<any> = stateMachineBuilder("EE")
		.withState("EE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("Entered EE")])
		.withState("EO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("Entered EO")])
		.withState("OE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("Entered OE")])
		.withState("OO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("Entered OO")])
		.withTransition("EE", "A", "OE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("EE -> OE")], predicate)
		.withTransition("EE", "B", "EO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("EE -> EO")], predicate)
		.withTransition("EO", "A", "OO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("EO -> OO")], predicate)
		.withTransition("EO", "B", "EE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("EO -> EE")], predicate)
		.withTransition("OE", "A", "EE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("OE -> EE")], predicate)
		.withTransition("OE", "B", "OO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("OE -> OO")], predicate)
		.withTransition("OO", "A", "EO", [(parameter: any, modelInstance: Model) => modelInstance.log.push("OO -> EO")], predicate)
		.withTransition("OO", "B", "OE", [(parameter: any, modelInstance: Model) => modelInstance.log.push("OO -> OE")], predicate)
		.build();

	const machineState: MachineState<Model> = machine.create(model);
	expect(machineState.getState()).toEqual("EE");

	machine.submit("A", machineState);
	expect(machineState.getState()).toEqual("OE");

	machine.submit("A", machineState);
	expect(machineState.getState()).toEqual("EE");

	machine.submit("B", machineState);
	expect(machineState.getState()).toEqual("EO");

	machine.submit("A", machineState);
	expect(machineState.getState()).toEqual("OO");

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

	const wkSpy = jest.spyOn(machine, '$dispose');
	machine.$dispose();
	expect(wkSpy).toBeCalledTimes(1);
});
