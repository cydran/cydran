import ObjectUtils from "@/util/ObjectUtils";

class ElementMediatorFactories {

	public static register(name: string, supportedTags: string[], elementMediatorClass: any): void {
		ObjectUtils.requireNotNull(name, "name");
		ObjectUtils.requireNotNull(supportedTags, "supportedTags");
		ObjectUtils.requireNotNull(elementMediatorClass, "elementMediatorClass");

		if (!ElementMediatorFactories.factories[name]) {
			ElementMediatorFactories.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			ElementMediatorFactories.factories[name][supportedTag] = elementMediatorClass;
		}
	}

	public static get<T>(type: string): T {
		return (ElementMediatorFactories.factories[type] as any) as T;
	}

	private static factories: {
		[elementMediatorType: string]: {
			[tag: string]: new () => any;
		}
	} = {};

}

export default ElementMediatorFactories;
