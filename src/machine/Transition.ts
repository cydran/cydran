import Disposable from "interface/ables/Disposable";
import MachineState from "machine/MachineState";

interface Transition<M> extends Disposable {

	execute(state: MachineState<M>, parameter: any): boolean;

	getTargetState(): string;

}

export default Transition;
