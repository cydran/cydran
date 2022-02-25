import Disposable from "interface/ables/Disposable";

interface MachineContext<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

}

export default MachineContext;
