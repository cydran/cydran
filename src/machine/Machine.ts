import Disposable from "interface/ables/Disposable";
import MachineContext from "machine/MachineContext";

interface Machine<M> extends Disposable {
	create(model: M): MachineContext<M>;

	evaluate(input: string, context: MachineContext<M>, parameter?: any): void;
}

export default Machine;
