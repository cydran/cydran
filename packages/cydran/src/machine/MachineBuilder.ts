import { VarPredicate, VarConsumer } from "interface/Predicate";
import Machine from "machine/Machine";

interface MachineBuilder<M> {

	withState(state: string, callbacks: VarConsumer<unknown, M>[]): MachineBuilder<M>;

	withTransition(state: string, input: string, targetState: string, callbacks: VarConsumer<unknown, M>[], predicate?: VarPredicate<unknown, M>): MachineBuilder<M>;

	build(): Machine<M>;

}

export default MachineBuilder;
