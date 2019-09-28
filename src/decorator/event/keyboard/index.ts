import { Mvvm } from "../../../Core";

import KeyDownEventDecorator from "./KeyDownEventDecorator";
Mvvm.register("keydown", ["*"], KeyDownEventDecorator);

import KeyPressEventDecorator from "./KeyPressEventDecorator";
Mvvm.register("keypress", ["*"], KeyPressEventDecorator);

import KeyUpEventDecorator from "./KeyUpEventDecorator";
Mvvm.register("keyup", ["*"], KeyUpEventDecorator);

export {};
