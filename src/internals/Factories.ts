import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Behavior from "behavior/Behavior";
import { requireNotNull } from "util/Utils";
class Factories {

	public static register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behaviorClass, "behaviorClass");

		if (!Factories.factories[name]) {
			Factories.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			Factories.factories[name][supportedTag] = behaviorClass;
		}
	}

	public static get<T>(type: string): T {
		return (Factories.factories[type] as any) as T;
	}

	private static factories: SimpleMap<SimpleMap<new () => any>> = {};

}

export default Factories;
