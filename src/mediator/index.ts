import { Mvvm } from "@/Core";

import Checked from "@/mediator/Checked";
Mvvm.register(Checked.KEY, ["input"], Checked);

import CSSClass from "@/mediator/CSSClass";
Mvvm.register(CSSClass.KEY, ["*"], CSSClass);

import Content from "@/mediator/Content";
Mvvm.register(Content.KEY, ["*"], Content);

import Enabled from "@/mediator/Enabled";
Mvvm.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "@/mediator/ReadOnly";
Mvvm.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "@/mediator/Style";
Mvvm.register(Style.KEY, ["*"], Style);

import ForceFocus from "@/mediator/ForceFocus";
Mvvm.register(ForceFocus.KEY, ["*"], ForceFocus);

import MultiSelectValueModel from "@/mediator/MultiSelectValueModel";
Mvvm.register(MultiSelectValueModel.KEY, ["select"], MultiSelectValueModel);

import ValuedModel from "@/mediator/ValuedModel";
Mvvm.register(ValuedModel.KEY, ["textarea"], ValuedModel);

import InputValueModel from "@/mediator/InputValueModel";
Mvvm.register(InputValueModel.KEY, ["input"], InputValueModel);

import Visible from "@/mediator/Visible";
Mvvm.register(Visible.KEY, ["*"], Visible);

import Repeat from "@/mediator/Repeat";
Mvvm.register("repeat", ["*"], Repeat);

export { };
