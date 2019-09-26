import { Mvvm } from "../../../Core";

import AbortEventDecorator from "./AbortEventDecorator";
import BeforeUnloadEventDecorator from "./BeforeUnloadEventDecorator";
import BlurEventDecorator from "./BlurEventDecorator";
import ChangeEventDecorator from "./ChangeEventDecorator";
import ErrorEventDecorator from "./ErrorEventDecorator";
import HashChangeEventDecorator from "./HashChangeEventDecorator";
import InputEventDecorator from "./InputEventDecorator";
import InvalidEventDecorator from "./InvalidEventDecorator";
import LoadEventDecorator from "./LoadEventDecorator";
import SelectEventDecorator from "./SelectEventDecorator";
import UnloadEventDecorator from "./UnloadEventDecorator";
import ReadyStateChangeEventDecorator from "./ReadyStateChangeEventDecorator";
import RedoEventDecorator from "./RedoEventDecorator";
import StorageEventDecorator from "./StorageEventDecorator";
import UndoEventDecorator from "./UndoEventDecorator";

Mvvm.register("beforeunload", ["*"], BeforeUnloadEventDecorator);
Mvvm.register("blur", ["*"], BlurEventDecorator);
Mvvm.register("change", ["*"], ChangeEventDecorator);
Mvvm.register("hashchange", ["*"], HashChangeEventDecorator);
Mvvm.register("input", ["*"], InputEventDecorator);
Mvvm.register("invalid", ["*"], InvalidEventDecorator);
Mvvm.register("load", ["*"], LoadEventDecorator);
Mvvm.register("select", ["*"], SelectEventDecorator);
Mvvm.register("unload", ["*"], UnloadEventDecorator);
Mvvm.register("abort", ["*"], AbortEventDecorator);
Mvvm.register("error", ["*"], ErrorEventDecorator);
Mvvm.register("redo", ["*"], RedoEventDecorator);
Mvvm.register("readystate", ["*"], ReadyStateChangeEventDecorator);
Mvvm.register("storage", ["*"], StorageEventDecorator);
Mvvm.register("undo", ["*"], UndoEventDecorator);

export {};