import Disposable from "interface/ables/Disposable";

interface MachineState<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

}

export default MachineState;
