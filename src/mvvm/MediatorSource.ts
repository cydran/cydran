import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";

interface MediatorSource {

	requestMediators(consumer: DigestionCandidateConsumer): void;

	requestMediatorSources(sources: MediatorSource[]): void;

	getGuard(): string;

}

export default MediatorSource;
