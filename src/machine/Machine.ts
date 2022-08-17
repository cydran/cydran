import Disposable from "interface/ables/Disposable";
import MachineState from "machine/MachineState";

interface Machine<M> extends Disposable {

	create(model: M): MachineState<M>;

	evaluate(input: string, context: MachineState<M>, parameter?: any): void;

}

export default Machine;
