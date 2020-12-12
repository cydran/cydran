import { Disposable } from "interface/Ables";
import { VarPredicate, VarConsumer } from "interface/Predicate";

interface Machine<M> extends Disposable {

	create(model: M): MachineContext<M>;

	evaluate(input: string, context: MachineContext<M>, parameter?: any): void;

}

interface MachineBuilder<M> {

	withState(state: string, callbacks: VarConsumer<any, M>[]): MachineBuilder<M>;

	withTransition(state: string, input: string, target: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>): MachineBuilder<M>;

	build(): Machine<M>;

}

interface MachineContext<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

}

interface Transition<M> extends Disposable {

	execute(context: MachineContext<M>, parameter: any): boolean;

	getTarget(): string;

}

interface State<M> extends Disposable {

	evaluate(input: string, context: MachineContext<M>, parameter: any): boolean;

}

export {
	Machine,
	MachineBuilder,
	MachineContext,
	Transition,
	State
};