import { Disposable, Tellable } from "interface/Ables";
import { DigestionCandidate } from "interface/Digest";

interface MediatorSource extends Tellable {
	// requestMediators(consumer: DigestionCandidateConsumer): void;

	// requestMediatorSources(sources: MediatorSource[]): void;

	getId(): string;
}
interface ModelMediator<T> extends Disposable, DigestionCandidate {
	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

	populate(): void;
}

interface ElementMediator<M, E extends HTMLElement | Text, P>
	extends Disposable, MediatorSource, Tellable {
	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

	onInit(): void;

	onPopulate(): void;

	onMount(): void;

	onUnmount(): void;

	onDispose(): void;

	onValidate(el: E, fn: (name: string, value?: any) => Validators): void;

	onNestingChanged(): void;
}

export {
	ElementMediator,
	MediatorSource,
	ModelMediator
};