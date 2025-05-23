import MachineState from "machine/MachineState";
import Releasable from "interface/ables/Releasable";

interface State<M> extends Releasable {

	evaluate(input: string, machineState: MachineState<M>, parameter: any): boolean;

}

export default State;
