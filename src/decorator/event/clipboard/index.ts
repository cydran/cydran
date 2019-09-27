import { Mvvm } from "../../../Core";

import CopyEventDecorator from "./CopyEventDecorator";
Mvvm.register("copy", ["*"], CopyEventDecorator);

import CutEventDecorator from "./CutEventDecorator";
Mvvm.register("cut", ["*"], CutEventDecorator);

import PasteEventDecorator from "./PasteEventDecorator";
Mvvm.register("paste", ["*"], PasteEventDecorator);


export {};
