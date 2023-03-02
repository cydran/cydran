import Disposable from "interface/ables/Disposable";

interface MachineState<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

	addInput(input: string): void;

	hasInput(): boolean;

	getNextInput(): string;

}

export default MachineState;
