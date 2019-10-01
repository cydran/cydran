import { Mvvm } from "../../../Core";

import TouchCancel from "./TouchCancel";
Mvvm.register("touchcancel", ["*"], TouchCancel);

import TouchEnd from "./TouchEnd";
Mvvm.register("touchend", ["*"], TouchEnd);

import TouchMove from "./TouchMove";
Mvvm.register("touchmove", ["*"], TouchMove);

import TouchStart from "./TouchStart";
Mvvm.register("touchstart", ["*"], TouchStart);

export {};
