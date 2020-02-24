import ObjectUtils from "@/util/ObjectUtils";
import SimpleMap from "@/pattern/SimpleMap";

const requireNotNull = ObjectUtils.requireNotNull;

class Factories {

	public static register(name: string, supportedTags: string[], elementMediatorClass: any): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(elementMediatorClass, "elementMediatorClass");

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

	private static factories: SimpleMap<SimpleMap<new () => any>> = {};

}

export default Factories;
