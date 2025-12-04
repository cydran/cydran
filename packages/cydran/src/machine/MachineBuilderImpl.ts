import { requireNotNull, isDefined } from "util/Utils";
import { VarPredicate, VarConsumer } from "interface/Predicate";

import MachineImpl from "machine/MachineImpl";
import { ValidationError } from "error/Errors";
import Machine from "machine/Machine";
import MachineBuilder from "machine/MachineBuilder";

class MachineBuilderImpl<M> implements MachineBuilder<M> {

	private instance: MachineImpl<M>;

	constructor(startState: string) {
		requireNotNull(startState, "startState");
		this.instance = new MachineImpl<M>(startState);
	}

	public withState(state: string, callbacks: VarConsumer<unknown, M>[]): MachineBuilder<M> {
		this.instance.withState(state, callbacks);

		return this;
	}

	public withTransition(
		state: string,
		input: string,
		targetState: string,
		callbacks: VarConsumer<unknown, M>[],
		predicate?: VarPredicate<unknown, M>
	): MachineBuilder<M> {
		this.instance.withTransition(state, input, targetState, callbacks, predicate);

		return this;
	}

	public build(): Machine<M> {
		if (!isDefined(this.instance)) {
			throw new ValidationError("No start state set");
		}

		this.instance.validate();

		return this.instance;
	}
}

export default MachineBuilderImpl;
