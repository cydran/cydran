import { Mvvm } from "../../../Core";

import KeyDownEventDecorator from "./KeyDownEventDecorator";
import KeyPressEventDecorator from "./KeyPressEventDecorator";
import KeyUpEventDecorator from "./KeyUpEventDecorator";

Mvvm.register("keydown", ["*"], KeyDownEventDecorator);
Mvvm.register("keypress", ["*"], KeyPressEventDecorator);
Mvvm.register("keyup", ["*"], KeyUpEventDecorator);

export {};
