import MachineBuilder from "machine/MachineBuilder";
import MachineBuilderImpl from "machine/MachineBuilderImpl";

function stateMachineBuilder<M>(startState: string): MachineBuilder<M> {
	return new MachineBuilderImpl<M>(startState);
}

export default stateMachineBuilder;
