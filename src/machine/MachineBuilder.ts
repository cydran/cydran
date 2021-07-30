import { VarPredicate, VarConsumer } from "interface/Predicate";
import Machine from "machine/Machine";

interface MachineBuilder<M> {

	withState(state: string, callbacks: VarConsumer<any, M>[]): MachineBuilder<M>;

	withTransition(state: string, input: string, target: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>): MachineBuilder<M>;

	build(): Machine<M>;

}

export default MachineBuilder;
