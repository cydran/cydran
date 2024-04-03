import { requireNotNull, defaulted } from 'util/Utils';
import MachineState from "machine/MachineState";
import Queue from "pattern/Queue";
import QueueImpl from "pattern/QueueImpl";
import Input from "machine/Input";

class MachineStateImpl<M> implements MachineState<M> {

	private state: string;

	private model: M;

	private inputs: Queue<Input>;

	private evaluationCount: number;

	constructor(state: string, model: M) {
		this.state = requireNotNull(state, "state");
		this.model = requireNotNull(model, "model");
		this.inputs = new QueueImpl<Input>();
		this.evaluationCount = 0;
	}

	public addInput(input: string, parameters?: any): void {
		requireNotNull(input, "input");
		const effectiveParameters: any = defaulted(parameters, {});

		this.inputs.add({
			value: input,
			parameters: effectiveParameters
		});
	}

	public incrementEvaluationCount(): void {
		this.evaluationCount++;
	}

	public decrementEvaluationCount(): void {
		if (this.evaluationCount > 0) {
			this.evaluationCount--;
		}
	}

	public isEvaluating(): boolean {
		return this.evaluationCount > 0;
	}

	public hasInput(): boolean {
		return this.inputs.isPopulated();
	}

	public getNextInput(): Input {
		return this.inputs.pop();
	}

	public getState(): string {
		return this.state;
	}

	public isState(state: string): boolean {
		return state === this.state;
	}

	public setState(state: string): void {
		this.state = state;
	}

	public getModel(): M {
		return this.model;
	}

	public $dispose(): void {
		this.state = null;
		this.model = null;
	}
}

export default MachineStateImpl;
