import Disposable from "interface/ables/Disposable";
import MachineState from "machine/MachineState";

interface Transition<M> extends Disposable {

	execute(context: MachineState<M>, parameter: any): boolean;

	getTarget(): string;

}

export default Transition;
