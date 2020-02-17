interface DigestionCandidate {

	evaluate(): boolean;

	execute(): void;

	notify(): void;

}

export default DigestionCandidate;
