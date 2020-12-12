import { Evaluatable, Notifyable } from "./Ables";

interface Digester {
	skipId(id: string): void;

	digest(): void;
}

interface DigestionCandidate extends Evaluatable, Notifyable {
	getExpression(): string;
}

interface DigestionCandidateConsumer {
	add(key: string, mediators: DigestionCandidate[]): void;
}

interface DigestionContext extends DigestionCandidateConsumer {
	digest(): Notifyable[];
}

export {
	Digester,
	DigestionCandidate,
	DigestionCandidateConsumer,
	DigestionContext
};