import Releasable from "interface/ables/Releasable";
import MachineState from "machine/MachineState";

interface Transition<M> extends Releasable {

	execute(state: MachineState<M>, parameter: any): boolean;

	getTargetState(): string;

}

export default Transition;
