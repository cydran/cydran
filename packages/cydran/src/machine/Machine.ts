import Disposable from "interface/ables/Disposable";
import MachineState from "machine/MachineState";

interface Machine<M> extends Disposable {

	create(model: M): MachineState<M>;

	submit(input: string, machineState: MachineState<M>, parameter?: any): void;

}

export default Machine;
