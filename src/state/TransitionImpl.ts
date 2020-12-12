import { requireNotNull, isDefined } from "Utils";
import { VarConsumer, VarPredicate } from "interface/Predicate";
import { MachineContext, Transition } from "interface/State";
import { ValidationError } from "error/Errors";

class TransitionImpl<M> implements Transition<M> {

	private target: string;

	private predicate: VarPredicate<any, M>;

	private callbacks: VarConsumer<any, M>[];

	constructor(target: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>) {
		this.target = requireNotNull(target, "target");
		this.predicate = isDefined(predicate) ? predicate : (model: M) => true;
		this.callbacks = requireNotNull(callbacks, "callbacks");
	}

	public execute(context: MachineContext<M>, parameter: any): boolean {
		const result: boolean = this.predicate.apply(context.getModel(), [parameter, context.getModel()]);

		if (result) {
			for (const callback of this.callbacks) {
				callback.apply(context.getModel(), [parameter, context.getModel()]);
			}
		}

		return result;
	}

	public getTarget(): string {
		return this.target;
	}

	public validate(stateNames: string[], errors: string[]): void {
		let idFound: boolean = false;

		for (const id of stateNames) {
			if (this.target === id) {
				idFound = true;
				break;
			}
		}

		if (!idFound) {
			throw new ValidationError(`State ${this.target} is not a valid state id`);
		}
	}

	public $dispose(): void {
		this.predicate = null;
	}

}

export default TransitionImpl;