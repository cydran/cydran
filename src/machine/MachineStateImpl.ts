import { requireNotNull } from "util/Utils";
import MachineState from "machine/MachineState";
import Queue from "pattern/Queue";
import QueueImpl from "pattern/QueueImpl";

class MachineStateImpl<M> implements MachineState<M> {

	private state: string;

	private model: M;

	private inputs: Queue<string>;

	constructor(state: string, model: M) {
		this.state = requireNotNull(state, "state");
		this.model = requireNotNull(model, "model");
		this.inputs = new QueueImpl<string>();
	}

	public addInput(input: string): void {
		requireNotNull(input, "input");

		this.inputs.add(input);
	}

	public hasInput(): boolean {
		return this.inputs.isPopulated();
	}

	public getNextInput(): string {
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
