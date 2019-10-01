import { Mvvm } from "../../../Core";

import AuxClick from "./AuxClick";
Mvvm.register("auxclick", ["*"], AuxClick);

import Click from "./Click";
Mvvm.register("click", ["*"], Click);

import ContextMenu from "./ContextMenu";
Mvvm.register("contextmenu", ["*"], ContextMenu);

import DblClick from "./DblClick";
Mvvm.register("dblclick", ["*"], DblClick);

import Drag from "./Drag";
Mvvm.register("drag", ["*"], Drag);

import DragEnd from "./DragEnd";
Mvvm.register("dragend", ["*"], DragEnd);

import DragEnter from "./DragEnter";
Mvvm.register("dragenter", ["*"], DragEnter);

import DragLeave from "./DragLeave";
Mvvm.register("dragleave", ["*"], DragLeave);

import DragOver from "./DragOver";
Mvvm.register("dragover", ["*"], DragOver);

import DragStart from "./DragStart";
Mvvm.register("dragstart", ["*"], DragStart);

import Drop from "./DragStart";
Mvvm.register("drop", ["*"], Drop);

import MouseDown from "./MouseDown";
Mvvm.register("mousedown", ["*"], MouseDown);

import MouseMove from "./MouseMove";
Mvvm.register("mousemove", ["*"], MouseMove);

import MouseOut from "./MouseOut";
Mvvm.register("mouseout", ["*"], MouseOut);

import MouseOver from "./MouseOver";
Mvvm.register("mouseover", ["*"], MouseOver);

import MouseUp from "./MouseUp";
Mvvm.register("mouseup", ["*"], MouseUp);

import MouseWheel from "./MouseWheel";
Mvvm.register("mousewheel", ["*"], MouseWheel);

import Show from "./Show";
Mvvm.register("show", ["*"], Show);

import Toggle from "./Toggle";
Mvvm.register("toggle", ["*"], Toggle);

import Wheel from "./Wheel";
Mvvm.register("wheel", ["*"], Wheel);

export {};
