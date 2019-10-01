import { Mvvm } from "../../../Core";

import Focus from "./Focus";
Mvvm.register("focus", ["*"], Focus);

import FocusIn from "./FocusIn";
Mvvm.register("focusin", ["*"], FocusIn);

import FocusOut from "./FocusOut";
Mvvm.register("focusout", ["*"], FocusOut);

export {};
