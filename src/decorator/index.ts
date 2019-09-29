import { Mvvm } from "../Core";
import "./event";

import AttributeElementDecorator from "./AttributeElementDecorator";
import CheckboxListDecorator from "./CheckboxListDecorator";
import ComponentEachElementDecorator from "./ComponentEachElementDecorator";
import DisableableModelElementDecorator from "./DisableableModelElementDecorator";
import ForceFocusElementDecorator from "./ForceFocusElementDecorator";
import InnerHtmlElementDecorator from "./InnerHtmlElementDecorator";
import RegionDecorator from "./RegionDecorator";
import SelectOptionsElementDecorator from "./SelectOptionsElementDecorator";
import ValuedModelElementDecorator from "./ValuedModelElementDecorator";
import VisibleElementDecorator from "./VisibleElementDecorator";
import EnabledDecorator from "./EnabledDecorator";
import ClassDecorator from "./ClassDecorator";

Mvvm.register("model", ["input", "select", "textarea"], ValuedModelElementDecorator);
Mvvm.register("model", ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "label", "div"], InnerHtmlElementDecorator);
Mvvm.register("options-model", ["select"], SelectOptionsElementDecorator);
Mvvm.register("enabled", ["select", "input", "textarea", "button"], DisableableModelElementDecorator);
Mvvm.register("attribute", ["*"], AttributeElementDecorator);
Mvvm.register("visible", ["*"], VisibleElementDecorator);
Mvvm.register("component-each", ["*"], ComponentEachElementDecorator);
Mvvm.register("force-focus", ["*"], ForceFocusElementDecorator);
Mvvm.register("region", ["*"], RegionDecorator);
Mvvm.register("checkbox-list", ["ul"], CheckboxListDecorator);

Mvvm.register("enabled", ["*"], EnabledDecorator);
Mvvm.register("class", ["*"], ClassDecorator);

export {};
