import Disposable from "interface/ables/Disposable";
import Input from "machine/Input";

interface MachineState<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

	addInput(input: string, parameters?: any): void;

	hasInput(): boolean;

	getNextInput(): Input;

	incrementEvaluationCount(): void;

	decrementEvaluationCount(): void;

	isEvaluating(): boolean;

}

export default MachineState;
