import { Mvvm } from "../../../Core";

import FocusEventDecorator from "./FocusEventDecorator";
Mvvm.register("focus", ["*"], FocusEventDecorator);

import FocusInEventDecorator from "./FocusInEventDecorator";
Mvvm.register("focusin", ["*"], FocusInEventDecorator);

import FocusOutEventDecorator from "./FocusOutEventDecorator";
Mvvm.register("focusout", ["*"], FocusOutEventDecorator);

export {};
