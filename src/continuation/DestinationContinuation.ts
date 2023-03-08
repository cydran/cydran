interface DestinationContinuation {

	toSelf(): void;

	toContext(): void;

	toParent(): void;

	toParents(): void;

	toChildren(): void;

	toDescendants(): void;

	globally(): void;

}

export default DestinationContinuation;
