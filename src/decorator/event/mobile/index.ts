import { Mvvm } from "../../../Core";

import TouchStartEventDecorator from "./TouchStartEventDecorator";
import TouchEndEventDecorator from "./TouchEndEventDecorator";
import TouchMoveEventDecorator from "./TouchMoveEventDecorator";
import TouchCancelEventDecorator from "./TouchCancelEventDecorator";

Mvvm.register("touchstart", ["*"], TouchStartEventDecorator);
Mvvm.register("touchend", ["*"], TouchEndEventDecorator);
Mvvm.register("touchmove", ["*"], TouchMoveEventDecorator);
Mvvm.register("touchcancel", ["*"], TouchCancelEventDecorator);

export {};
