import ObjectUtils from "@/util/ObjectUtils";

class Factories {

	public static register(name: string, supportedTags: string[], elementMediatorClass: any): void {
		ObjectUtils.requireNotNull(name, "name");
		ObjectUtils.requireNotNull(supportedTags, "supportedTags");
		ObjectUtils.requireNotNull(elementMediatorClass, "elementMediatorClass");

		if (!Factories.factories[name]) {
			Factories.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			Factories.factories[name][supportedTag] = elementMediatorClass;
		}
	}

	public static get<T>(type: string): T {
		return (Factories.factories[type] as any) as T;
	}

	private static factories: {
		[elementMediatorType: string]: {
			[tag: string]: new () => any;
		}
	} = {};

}

export default Factories;
