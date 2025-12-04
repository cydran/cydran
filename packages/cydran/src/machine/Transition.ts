import Releasable from "interface/ables/Releasable";
import MachineState from "machine/MachineState";

interface Transition<M> extends Releasable {

	execute(state: MachineState<M>, parameter: unknown): boolean;

	executeCallbacks(model: M, parameter: unknown): void;

	getTargetState(): string;

}

export default Transition;
