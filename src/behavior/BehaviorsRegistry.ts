import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Behavior from "behavior/Behavior";
import { isDefined, requireNotNull } from "util/Utils";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { BehaviorError } from "error/Errors";

class BehaviorsRegistry {

	public static register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behaviorClass, "behaviorClass");

		const map: SimpleMap<new () => any> = BehaviorsRegistry.classes.computeIfAbsent(name, (key) => ({} as SimpleMap<new () => any>));

		for (const supportedTag of supportedTags) {
			map[supportedTag] = behaviorClass;
		}
	}

	public static lookup(type: string, tag: string): Type<Behavior<any, HTMLElement, any>> {
		const tags: SimpleMap<Type<Behavior<any, HTMLElement, any>>> = BehaviorsRegistry.get(type);

		if (!isDefined(tags)) {
			throw new BehaviorError("Unsupported behavior attribute");
		}

		let behaviorClass: Type<Behavior<any, HTMLElement, any>> = tags[tag];

		if (!isDefined(behaviorClass)) {
			behaviorClass = tags["*"];
		}

		if (!isDefined(behaviorClass)) {
			throw new BehaviorError(`Unsupported tag: ${tag} for behavior`);
		}

		return behaviorClass;
	}

	private static get<T>(type: string): T {
		return BehaviorsRegistry.classes.get(type) as any as T;
	}

	private static classes: AdvancedMap<SimpleMap<new () => any>> = new AdvancedMapImpl<SimpleMap<new () => any>>();

}

export default BehaviorsRegistry;
