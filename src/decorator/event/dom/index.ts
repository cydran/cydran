import { Mvvm } from "../../../Core";

import AbortEventDecorator from "./AbortEventDecorator";
Mvvm.register("abort", ["*"], AbortEventDecorator);

import BeforeUnloadEventDecorator from "./BeforeUnloadEventDecorator";
Mvvm.register("beforeunload", ["*"], BeforeUnloadEventDecorator);

import BlurEventDecorator from "./BlurEventDecorator";
Mvvm.register("blur", ["*"], BlurEventDecorator);

import ChangeEventDecorator from "./ChangeEventDecorator";
Mvvm.register("change", ["*"], ChangeEventDecorator);

import ErrorEventDecorator from "./ErrorEventDecorator";
Mvvm.register("error", ["*"], ErrorEventDecorator);

import HashChangeEventDecorator from "./HashChangeEventDecorator";
Mvvm.register("hashchange", ["*"], HashChangeEventDecorator);

import InputEventDecorator from "./InputEventDecorator";
Mvvm.register("input", ["*"], InputEventDecorator);

import InvalidEventDecorator from "./InvalidEventDecorator";
Mvvm.register("invalid", ["*"], InvalidEventDecorator);

import LoadEventDecorator from "./LoadEventDecorator";
Mvvm.register("load", ["*"], LoadEventDecorator);

import ReadyStateChangeEventDecorator from "./ReadyStateChangeEventDecorator";
Mvvm.register("readystate", ["*"], ReadyStateChangeEventDecorator);

import RedoEventDecorator from "./RedoEventDecorator";
Mvvm.register("redo", ["*"], RedoEventDecorator);

import SelectEventDecorator from "./SelectEventDecorator";
Mvvm.register("select", ["*"], SelectEventDecorator);

import StorageEventDecorator from "./StorageEventDecorator";
Mvvm.register("storage", ["*"], StorageEventDecorator);

import UndoEventDecorator from "./UndoEventDecorator";
Mvvm.register("undo", ["*"], UndoEventDecorator);

import UnloadEventDecorator from "./UnloadEventDecorator";
Mvvm.register("unload", ["*"], UnloadEventDecorator);

export {};