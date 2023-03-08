import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Behavior from "behavior/Behavior";
import { isDefined, requireNotNull } from "util/Utils";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { BehaviorError } from "error/Errors";

type BehaviorFunction = (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>;

class BehaviorsRegistryImpl {

	private static classes: AdvancedMap<SimpleMap<(el: HTMLElement) => new () => any>> = new AdvancedMapImpl<SimpleMap<(el: HTMLElement) => new () => any>>();

	public static register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behaviorClass, "behaviorClass");
		this.registerFunction(name, supportedTags, (el: HTMLElement) => behaviorClass);
	}

	public static registerFunction(name: string, supportedTags: string[], behaviorFunction: BehaviorFunction): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behaviorFunction, "behaviorFunction");

		// TODO - Check for collisions

		const map: SimpleMap<BehaviorFunction> = BehaviorsRegistryImpl.classes.computeIfAbsent(name, (key) => ({} as SimpleMap<BehaviorFunction>));

		for (const supportedTag of supportedTags) {
			map[supportedTag] = behaviorFunction;
		}
	}

	public static lookup(el: HTMLElement, type: string, tag: string): Type<Behavior<any, HTMLElement, any>> {
		const tags: SimpleMap<BehaviorFunction> = this.get(type);

		if (!isDefined(tags)) {
			throw new BehaviorError("Unsupported behavior attribute");
		}

		let behaviorFunction: BehaviorFunction = tags[tag];

		if (!isDefined(behaviorFunction)) {
			behaviorFunction = tags["*"];
		}

		if (!isDefined(behaviorFunction)) {
			throw new BehaviorError(`Unsupported tag: ${tag} for behavior`);
		}

		const behaviorClass: Type<Behavior<any, HTMLElement, any>> = behaviorFunction(el);

		return behaviorClass;
	}

	public static get<T>(type: string): T {
		return BehaviorsRegistryImpl.classes.get(type) as any as T;
	}

}

export default BehaviorsRegistryImpl;
