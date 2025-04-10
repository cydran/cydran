import { requireNotNull } from "util/Utils";

class PropertyGeneralizationMapper {

	private preferredKey: string;

	private prefix: string;

	private mapper: (key: string) => any;

	constructor(preferredKey: string, prefix: string, mapper: (key: string) => any) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
		this.mapper = requireNotNull(mapper, "mapper");
	}

	public getMapper(): (key: string, value: any) => any {
		return (key, value) => this.determineValue(key, value);
	}

	private determineValue(key: string, value: any): any {
		return (value === undefined) ? this.mapper(key) : value;
	}

}

export default PropertyGeneralizationMapper;