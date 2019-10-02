import { Mvvm } from "../Core";
import "./event";

import Attribute from "./Attribute";
Mvvm.register("attribute", ["*"], Attribute);

import CheckboxList from "./CheckboxList";
Mvvm.register("checkbox-list", ["ul"], CheckboxList);

import ComponentEach from "./ComponentEach";
Mvvm.register("component-each", ["*"], ComponentEach);

import CSSClass from "./CSSClass";
Mvvm.register("class", ["*"], CSSClass);

import Enabled from "./Enabled";
Mvvm.register("enabled", ["*"], Enabled);

import ReadOnly from "./ReadOnly";
Mvvm.register(ReadOnly.KEY, ["*"], ReadOnly);

import MinLength from "./MinLength";
Mvvm.register(MinLength.KEY, ["*"], MinLength);

import MaxLength from "./MaxLength";
Mvvm.register(MaxLength.KEY, ["*"], MaxLength);

import Style from "./Style";
Mvvm.register(Style.KEY, ["*"], Style);

import ForceFocus from "./ForceFocus";
Mvvm.register("force-focus", ["*"], ForceFocus);

import Region from "./Region";
Mvvm.register("region", ["*"], Region);

import SelectOptions from "./SelectOptions";
Mvvm.register("options-model", ["select"], SelectOptions);

import ValuedModel from "./ValuedModel";
Mvvm.register("model", ["input", "select", "textarea"], ValuedModel);

import Visible from "./Visible";
Mvvm.register("visible", ["*"], Visible);

export {};
