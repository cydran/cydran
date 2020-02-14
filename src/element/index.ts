import ElementMediatorFactories from "@/mvvm/ElementMediatorFactories";

import Checked from "@/element/Checked";
ElementMediatorFactories.register(Checked.KEY, ["input"], Checked);

import CSSClass from "@/element/CSSClass";
ElementMediatorFactories.register(CSSClass.KEY, ["*"], CSSClass);

import Enabled from "@/element/Enabled";
ElementMediatorFactories.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "@/element/ReadOnly";
ElementMediatorFactories.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "@/element/Style";
ElementMediatorFactories.register(Style.KEY, ["*"], Style);

import ForceFocus from "@/element/ForceFocus";
ElementMediatorFactories.register(ForceFocus.KEY, ["*"], ForceFocus);

import MultiSelectValueModel from "@/element/MultiSelectValueModel";
ElementMediatorFactories.register(MultiSelectValueModel.KEY, ["select"], MultiSelectValueModel);

import ValuedModel from "@/element/ValuedModel";
ElementMediatorFactories.register(ValuedModel.KEY, ["textarea"], ValuedModel);

import InputValueModel from "@/element/InputValueModel";
ElementMediatorFactories.register(InputValueModel.KEY, ["input"], InputValueModel);

import Visible from "@/element/Visible";
ElementMediatorFactories.register(Visible.KEY, ["*"], Visible);

import If from "@/element/If";
ElementMediatorFactories.register(If.KEY, ["*"], If);

import Repeat from "@/element/Repeat";
ElementMediatorFactories.register("repeat", ["*"], Repeat);

export { };
