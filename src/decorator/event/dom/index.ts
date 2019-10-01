import { Mvvm } from "../../../Core";

import Abort from "./Abort";
Mvvm.register("abort", ["*"], Abort);

import BeforeUnload from "./BeforeUnload";
Mvvm.register("beforeunload", ["*"], BeforeUnload);

import Blur from "./Blur";
Mvvm.register("blur", ["*"], Blur);

import Change from "./Change";
Mvvm.register("change", ["*"], Change);

import Error from "./Error";
Mvvm.register("error", ["*"], Error);

import HashChange from "./HashChange";
Mvvm.register("hashchange", ["*"], HashChange);

import Input from "./Input";
Mvvm.register("input", ["*"], Input);

import Invalid from "./Invalid";
Mvvm.register("invalid", ["*"], Invalid);

import Load from "./Load";
Mvvm.register("load", ["*"], Load);

import ReadyStateChange from "./ReadyStateChange";
Mvvm.register("readystate", ["*"], ReadyStateChange);

import Redo from "./Redo";
Mvvm.register("redo", ["*"], Redo);

import Select from "./Select";
Mvvm.register("select", ["*"], Select);

import Storage from "./Storage";
Mvvm.register("storage", ["*"], Storage);

import Undo from "./Undo";
Mvvm.register("undo", ["*"], Undo);

import Unload from "./Unload";
Mvvm.register("unload", ["*"], Unload);

export {};