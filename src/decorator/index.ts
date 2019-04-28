import {Mvvm} from "../Core";

import AttributeElementDecorator from "./AttributeDecorator";
import CheckboxListDecorator from "./CheckboxListDecorator";
import ClickElementDecorator from "./ClickDecorator";
import ComponentEachElementDecorator from "./ComponentEachDecorator";
import DisableableModelElementDecorator from "./DisableableModelDecorator";
import ForceFocusElementDecorator from "./ForceFocusDecorator";
import InnerHtmlElementDecorator from "./InnerHtmlDecorator";
import KeydownElementDecorator from "./KeydownDecorator";
import RegionDecorator from "./RegionDecorator";
import SelectOptionsElementDecorator from "./SelectOptionsDecorator";
import ValuedModelElementDecorator from "./ValuedModelDecorator";
import VisibleElementDecorator from "./VisibleDecorator";

Mvvm.register("click", ["*"], ClickElementDecorator);
Mvvm.register("model", ["input", "select", "textarea"], ValuedModelElementDecorator);
Mvvm.register("model", ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "label", "div"], InnerHtmlElementDecorator);
Mvvm.register("options-model", ["select"], SelectOptionsElementDecorator);
Mvvm.register("enabled", ["select", "input", "textarea", "button"], DisableableModelElementDecorator);
Mvvm.register("attribute", ["*"], AttributeElementDecorator);
Mvvm.register("keydown", ["*"], KeydownElementDecorator);
Mvvm.register("visible", ["*"], VisibleElementDecorator);
Mvvm.register("component-each", ["*"], ComponentEachElementDecorator);
Mvvm.register("force-focus", ["*"], ForceFocusElementDecorator);
Mvvm.register("region", ["*"], RegionDecorator);
Mvvm.register("checkbox-list", ["ul"], CheckboxListDecorator);
