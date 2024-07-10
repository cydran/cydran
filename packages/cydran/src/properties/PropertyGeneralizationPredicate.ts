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

	public getPredicate(): (key: string, value: any) => boolean {
		return (key: string, value: any) => this.isMatched(key, value);
	}

	private isMatched(key: string, value: any): boolean {
		if (!isDefined(key) || !isDefined(this.supportedProperties.has(key))) {
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
