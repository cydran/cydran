import Disposable from "interface/ables/Disposable";
import MachineContext from "machine/MachineContext";

interface Transition<M> extends Disposable {
	execute(context: MachineContext<M>, parameter: any): boolean;

	getTarget(): string;
}

export default Transition;
