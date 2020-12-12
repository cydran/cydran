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

export {
	MediatorSource,
	ModelMediator
};