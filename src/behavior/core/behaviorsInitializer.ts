import Stage from "stage/Stage";
import CheckedBehavior from "behavior/core/CheckedBehavior";
import CSSClassBehavior from "behavior/core/CSSClassBehavior";
import EachBehavior from "behavior/core/EachBehavior";
import EnabledBehavior from "behavior/core/EnabledBehavior";
import FocusBehavior from "behavior/core/FocusBehavior";
import HiddenBehavior from "behavior/core/HiddenBehavior";
import IdBehavior from "behavior/core/IdBehavior";
import IfBehavior from "behavior/core/IfBehavior";
import ReadOnlyBehavior from "behavior/core/ReadOnlyBehavior";
import ValidatedBehavior from "behavior/core/ValidatedBehavior";
import StyleBehavior from "behavior/core/StyleBehavior";
import RequiredBehavior from "behavior/core/RequiredBehavior";
import MultiSelectValueModelBehavior from "behavior/core/MultiSelectValueModelBehavior";
import Behavior from "behavior/Behavior";
import ValuedModelBehavior from "behavior/core/ValuedModelBehavior";
import RadioModelBehavior from "behavior/core/RadioModelBehavior";
import { isDefined } from "util/Utils";
import Type from "interface/Type";

type BehaviorFunction = (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>;

function behaviorsInitializer(stage: Stage) {
	const fn: BehaviorFunction = (el: HTMLInputElement) => isDefined(el.type) && el.type.toLowerCase() === "radio" ? RadioModelBehavior : ValuedModelBehavior;
	stage.registerBehavior("model", ["textarea"], ValuedModelBehavior);
	stage.registerBehaviorFunction("model", ["input"], fn);
	stage.registerBehavior("model", ["select"], MultiSelectValueModelBehavior);
	stage.registerBehavior("required", ["input", "select", "textarea"], RequiredBehavior);
	stage.registerBehavior("style", ["*"], StyleBehavior);
	stage.registerBehavior("validated", ["*"], ValidatedBehavior);
	stage.registerBehavior("readonly", ["input", "textarea"], ReadOnlyBehavior);
	stage.registerBehavior("if", ["*"], IfBehavior);
	stage.registerBehavior("id", ["*"], IdBehavior);
	stage.registerBehavior("hidden", ["*"], HiddenBehavior);
	stage.registerBehavior("focus", ["*"], FocusBehavior);
	stage.registerBehavior("enabled", ["*"], EnabledBehavior);
	stage.registerBehavior("each", ["*"], EachBehavior);
	stage.registerBehavior("class", ["*"], CSSClassBehavior);
	stage.registerBehavior("checked", ["input"], CheckedBehavior);
}

export default behaviorsInitializer;
