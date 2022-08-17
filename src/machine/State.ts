import Disposable from "interface/ables/Disposable";
import MachineState from "machine/MachineState";

interface State<M> extends Disposable {

	evaluate(input: string, context: MachineState<M>, parameter: any): boolean;

}

export default State;
