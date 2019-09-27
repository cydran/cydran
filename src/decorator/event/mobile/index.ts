import { Mvvm } from "../../../Core";

import TouchCancelEventDecorator from "./TouchCancelEventDecorator";
Mvvm.register("touchcancel", ["*"], TouchCancelEventDecorator);

import TouchEndEventDecorator from "./TouchEndEventDecorator";
Mvvm.register("touchend", ["*"], TouchEndEventDecorator);

import TouchMoveEventDecorator from "./TouchMoveEventDecorator";
Mvvm.register("touchmove", ["*"], TouchMoveEventDecorator);

import TouchStartEventDecorator from "./TouchStartEventDecorator";
Mvvm.register("touchstart", ["*"], TouchStartEventDecorator);

export {};
