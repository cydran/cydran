import { requireNotNull } from "util/Utils";
import MachineContext from "machine/MachineContext";

class MachineContextImpl<M> implements MachineContext<M> {
	private state: string;

	private model: M;

	constructor(state: string, model: M) {
		this.state = requireNotNull(state, "state");
		this.model = requireNotNull(model, "model");
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

export default MachineContextImpl;
