import { Mvvm } from "../../../Core";

import FocusEventDecorator from "./FocusEventDecorator";
import FocusInEventDecorator from "./FocusInEventDecorator";
import FocusOutEventDecorator from "./FocusOutEventDecorator";

Mvvm.register("focus", ["*"], FocusEventDecorator);
Mvvm.register("focusin", ["*"], FocusInEventDecorator);
Mvvm.register("focusout", ["*"], FocusOutEventDecorator);

export {};
