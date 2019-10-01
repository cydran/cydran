import { Mvvm } from "../../../Core";

import KeyDown from "./KeyDown";
Mvvm.register("keydown", ["*"], KeyDown);

import KeyPress from "./KeyPress";
Mvvm.register("keypress", ["*"], KeyPress);

import KeyUp from "./KeyUp";
Mvvm.register("keyup", ["*"], KeyUp);

export {};
