import { Mvvm } from "../Core";

import Checked from "./Checked";
Mvvm.register(Checked.KEY, ["input"], Checked);

import CSSClass from "./CSSClass";
Mvvm.register(CSSClass.KEY, ["*"], CSSClass);

import Content from "./Content";
Mvvm.register(Content.KEY, ["*"], Content);

import Enabled from "./Enabled";
Mvvm.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "./ReadOnly";
Mvvm.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "./Style";
Mvvm.register(Style.KEY, ["*"], Style);

import ForceFocus from "./ForceFocus";
Mvvm.register(ForceFocus.KEY, ["*"], ForceFocus);

import MultiSelectValueModel from "./MultiSelectValueModel";
Mvvm.register(MultiSelectValueModel.KEY, ["select"], MultiSelectValueModel);

import ValuedModel from "./ValuedModel";
Mvvm.register(ValuedModel.KEY, ["input", "textarea"], ValuedModel);

import Visible from "./Visible";
Mvvm.register(Visible.KEY, ["*"], Visible);

import Repeat from "./Repeat";
Mvvm.register("repeat", ["*"], Repeat);

export { };
