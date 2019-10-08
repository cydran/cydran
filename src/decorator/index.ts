import {Mvvm} from "../Core";

import CSSClass from "./CSSClass";
Mvvm.register(CSSClass.KEY, ["*"], CSSClass);

import Enabled from "./Enabled";
Mvvm.register(Enabled.KEY, ["*"], Enabled);

import ReadOnly from "./ReadOnly";
Mvvm.register(ReadOnly.KEY, ["*"], ReadOnly);

import Style from "./Style";
Mvvm.register(Style.KEY, ["*"], Style);

import ForceFocus from "./ForceFocus";
Mvvm.register(ForceFocus.KEY, ["*"], ForceFocus);

import SelectOptions from "./SelectOptions";
Mvvm.register(SelectOptions.KEY, ["select"], SelectOptions);

import ValuedModel from "./ValuedModel";
Mvvm.register(ValuedModel.KEY, ["input", "select", "textarea"], ValuedModel);

import Visible from "./Visible";
Mvvm.register(Visible.KEY, ["*"], Visible);

export {};
