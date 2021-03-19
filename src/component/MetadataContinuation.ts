interface MetadataContinuation {

	has: (name: string) => boolean;

	get: (name: string) => any;

}

export default MetadataContinuation;