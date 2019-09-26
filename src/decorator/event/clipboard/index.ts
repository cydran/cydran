import { Mvvm } from "../../../Core";

import CopyEventDecorator from "./CopyEventDecorator";
import CutEventDecorator from "./CutEventDecorator";
import PasteEventDecorator from "./PasteEventDecorator";

Mvvm.register("copy", ["*"], CopyEventDecorator);
Mvvm.register("cut", ["*"], CutEventDecorator);
Mvvm.register("paste", ["*"], PasteEventDecorator);

export {};
