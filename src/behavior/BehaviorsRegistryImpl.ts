import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Behavior from "behavior/Behavior";
import { isDefined, requireNotNull } from "util/Utils";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { BehaviorError } from "error/Errors";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";

type BehaviorFunction = (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>;

class BehaviorsRegistryImpl implements BehaviorsRegistry {

	private classes: AdvancedMap<SimpleMap<(el: HTMLElement) => new () => any>> = new AdvancedMapImpl<SimpleMap<(el: HTMLElement) => new () => any>>();

	public register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behaviorClass, "behaviorClass");
		this.registerFunction(name, supportedTags, (el: HTMLElement) => behaviorClass);
	}

	public registerFunction(name: string, supportedTags: string[], behavionFunction: BehaviorFunction): void {
		requireNotNull(name, "name");
		requireNotNull(supportedTags, "supportedTags");
		requireNotNull(behavionFunction, "behavionFunction");

		const map: SimpleMap<BehaviorFunction> = this.classes.computeIfAbsent(name, (key) => ({} as SimpleMap<BehaviorFunction>));

		for (const supportedTag of supportedTags) {
			map[supportedTag] = behavionFunction;
		}
	}

	public lookup(el: HTMLElement, type: string, tag: string): Type<Behavior<any, HTMLElement, any>> {
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

	private get<T>(type: string): T {
		return this.classes.get(type) as any as T;
	}

}

export default BehaviorsRegistryImpl;
