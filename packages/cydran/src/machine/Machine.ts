import MachineState from "machine/MachineState";
import Releasable from "interface/ables/Releasable";

interface Machine<M> extends Releasable {

	create(model: M): MachineState<M>;

	submit(input: string, machineState: MachineState<M>, parameter?: any): void;

}

export default Machine;
