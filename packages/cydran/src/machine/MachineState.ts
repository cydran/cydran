import Releasable from "interface/ables/Releasable";

interface MachineState<M> extends Releasable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

}

export default MachineState;
