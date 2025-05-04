interface MetadataContinuation {

	has: (name: string) => boolean;

	get:<T>(name: string) => T;

}

export default MetadataContinuation;
