import { Mvvm } from "../Core";
import "./event";

import Attribute from "./Attribute";
import CheckboxList from "./CheckboxList";
import ComponentEach from "./ComponentEach";
import DisableableModel from "./DisableableModel";
import ForceFocus from "./ForceFocus";
import Region from "./Region";
import SelectOptions from "./SelectOptions";
import ValuedModel from "./ValuedModel";
import Visible from "./Visible";
import Enabled from "./Enabled";
import CSSClass from "./CSSClass";

Mvvm.register("model", ["input", "select", "textarea"], ValuedModel);
Mvvm.register("options-model", ["select"], SelectOptions);
Mvvm.register("enabled", ["select", "input", "textarea", "button"], DisableableModel);
Mvvm.register("attribute", ["*"], Attribute);
Mvvm.register("visible", ["*"], Visible);
Mvvm.register("component-each", ["*"], ComponentEach);
Mvvm.register("force-focus", ["*"], ForceFocus);
Mvvm.register("region", ["*"], Region);
Mvvm.register("checkbox-list", ["ul"], CheckboxList);

Mvvm.register("enabled", ["*"], Enabled);
Mvvm.register("class", ["*"], CSSClass);

export {};
