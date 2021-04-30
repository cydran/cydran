import Tellable from "interface/ables/Tellable";

interface MediatorSource extends Tellable {
	// requestMediators(consumer: DigestionCandidateConsumer): void;

	// requestMediatorSources(sources: MediatorSource[]): void;

	getId(): string;
}

export default MediatorSource;