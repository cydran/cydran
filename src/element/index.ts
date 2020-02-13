import Checked from "@/element/Checked";
MvvmImpl.register(Checked.KEY, ["input"], Checked);

import CSSClass from "@/element/CSSClass";
MvvmImpl.register(CSSClass.KEY, ["*"], CSSClass);

import Enabled from "@/element/Enabled";
MvvmImpl.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "@/element/ReadOnly";
MvvmImpl.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "@/element/Style";
MvvmImpl.register(Style.KEY, ["*"], Style);

import ForceFocus from "@/element/ForceFocus";
MvvmImpl.register(ForceFocus.KEY, ["*"], ForceFocus);

import MultiSelectValueModel from "@/element/MultiSelectValueModel";
MvvmImpl.register(MultiSelectValueModel.KEY, ["select"], MultiSelectValueModel);

import ValuedModel from "@/element/ValuedModel";
MvvmImpl.register(ValuedModel.KEY, ["textarea"], ValuedModel);

import InputValueModel from "@/element/InputValueModel";
MvvmImpl.register(InputValueModel.KEY, ["input"], InputValueModel);

import Visible from "@/element/Visible";
MvvmImpl.register(Visible.KEY, ["*"], Visible);

import If from "@/element/If";
MvvmImpl.register(If.KEY, ["*"], If);

import Repeat from "@/element/Repeat";
MvvmImpl.register("repeat", ["*"], Repeat);

import MvvmImpl from "@/mvvm/MvvmImpl";

export { };
