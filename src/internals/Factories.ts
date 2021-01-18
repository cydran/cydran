import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import ElementMediator from "mediator/ElementMediator";
import { requireNotNull } from "util/Utils";

import Each from "mediator/core/Each";
import Checked from "mediator/core/Checked";
import CSSClass from "mediator/core/CSSClass";
import Enabled from "mediator/core/Enabled";
import ForceFocus from "mediator/core/ForceFocus";
import Hidden from "mediator/core/Hidden";
import If from "mediator/core/If";
import InputValueModel from "mediator/core/InputValueModel";
import MultiSelectValueModel from "mediator/core/MultiSelectValueModel";
import ValuedModel from "mediator/core/ValuedModel";
import ReadOnly from "mediator/core/ReadOnly";
import Style from "mediator/core/Style";

class Factories {
	public static register(
		name: string,
		supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>
	): void {
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

Factories.register("each", ["*"], Each);
Factories.register("checked", ["input"], Checked);
Factories.register("class", ["*"], CSSClass);
Factories.register("enabled", ["*"], Enabled);
Factories.register("force-focus", ["*"], ForceFocus);
Factories.register("hidden", ["*"], Hidden);
Factories.register("if", ["*"], If);
Factories.register("model", ["input"], InputValueModel);
Factories.register("model", ["select"], MultiSelectValueModel);
Factories.register("model", ["textarea"], ValuedModel);
Factories.register("readonly", ["*"], ReadOnly);
Factories.register("style", ["*"], Style);

export default Factories;