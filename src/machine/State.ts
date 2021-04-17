import Disposable from "interface/ables/Disposable";
import MachineContext from "machine/MachineContext";

interface State<M> extends Disposable {

	evaluate(input: string, context: MachineContext<M>, parameter: any): boolean;

}

export default State;
