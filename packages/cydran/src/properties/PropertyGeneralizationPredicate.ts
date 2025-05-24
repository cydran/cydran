import AdvancedMap from "pattern/AdvancedMap";
import { isDefined, requireNotNull } from "util/Utils";
import propertyMapGenerator from "properties/propertyMapGenerator";

class PropertyGeneralizationPredicate {

	private supportedProperties: AdvancedMap<string[]>;

	private predicate: (key: string) => boolean;

	constructor(preferredKey: string, prefix: string = null, predicate: (key: string) => boolean) {
		requireNotNull(preferredKey, "preferredKey");
		this.predicate = requireNotNull(predicate, "predicate");
		this.supportedProperties = propertyMapGenerator(preferredKey, prefix);
	}

	public getPredicate(): (key: string, value: unknown) => boolean {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return (key: string, value: unknown) => this.isMatched(key);
	}

	private isMatched(key: string): boolean {
		if (!isDefined(key) || !isDefined(this.supportedProperties.has(key))) {
			return false;
		}

		if (!this.supportedProperties.has(key)) {
			return false;
		}
		
		const keysToCheck: string[] = this.supportedProperties.get(key);

		let alternativeExists: boolean = false;

		for (let i = 0; i < keysToCheck.length; i++) {
			const keyToCheck: string = keysToCheck[i];

			if (this.predicate(keyToCheck)) {
				alternativeExists = true;
				break;
			}
		}

		return !alternativeExists;
	}

}

export default PropertyGeneralizationPredicate;
