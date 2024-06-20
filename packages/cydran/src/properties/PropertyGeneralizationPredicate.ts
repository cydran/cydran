class PropertyGeneralizationPredicate {

	private preferredKey: string;

	private prefix: string;

	constructor(preferredKey: string, prefix: string) {
		this.preferredKey = preferredKey;
		this.prefix = prefix;
	}

	public getPredicate(): (key: string, value: any) => boolean {
		return (key: string, value: any) => this.isMatched(key, value);
	}

	private isMatched(key: string, value: any): boolean {
		// TODO - Implement

		return true;
	}

}

export default PropertyGeneralizationPredicate;
