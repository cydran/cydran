import { Mvvm } from "../../../Core";

import AuxClickEventDecorator from "./AuxClickEventDecorator";
Mvvm.register("auxclick", ["*"], AuxClickEventDecorator);

import ClickEventDecorator from "./ClickEventDecorator";
Mvvm.register("click", ["*"], ClickEventDecorator);

import ContextMenuEventDecorator from "./ContextMenuEventDecorator";
Mvvm.register("contextmenu", ["*"], ContextMenuEventDecorator);

import DblClickEventDecorator from "./DblClickEventDecorator";
Mvvm.register("dblclick", ["*"], DblClickEventDecorator);

import DragEventDecorator from "./DragEventDecorator";
Mvvm.register("drag", ["*"], DragEventDecorator);

import DragEndEventDecorator from "./DragEndEventDecorator";
Mvvm.register("dragend", ["*"], DragEndEventDecorator);

import DragEnterEventDecorator from "./DragEnterEventDecorator";
Mvvm.register("dragenter", ["*"], DragEnterEventDecorator);

import DragLeaveEventDecorator from "./DragLeaveEventDecorator";
Mvvm.register("dragleave", ["*"], DragLeaveEventDecorator);

import DragOverEventDecorator from "./DragOverEventDecorator";
Mvvm.register("dragover", ["*"], DragOverEventDecorator);

import DragStartEventDecorator from "./DragStartEventDecorator";
Mvvm.register("dragstart", ["*"], DragStartEventDecorator);

import DropEventDecorator from "./DragStartEventDecorator";
Mvvm.register("drop", ["*"], DropEventDecorator);

import MouseDownEventDecorator from "./MouseDownEventDecorator";
Mvvm.register("mousedown", ["*"], MouseDownEventDecorator);

import MouseMoveEventDecorator from "./MouseMoveEventDecorator";
Mvvm.register("mousemove", ["*"], MouseMoveEventDecorator);

import MouseOutEventDecorator from "./MouseOutEventDecorator";
Mvvm.register("mouseout", ["*"], MouseOutEventDecorator);

import MouseOverEventDecorator from "./MouseOverEventDecorator";
Mvvm.register("mouseover", ["*"], MouseOverEventDecorator);

import MouseUpEventDecorator from "./MouseUpEventDecorator";
Mvvm.register("mouseup", ["*"], MouseUpEventDecorator);

import MouseWheelEventDecorator from "./MouseWheelEventDecorator";
Mvvm.register("mousewheel", ["*"], MouseWheelEventDecorator);

import ShowEventDecorator from "./ShowEventDecorator";
Mvvm.register("show", ["*"], ShowEventDecorator);

import ToggleEventDecorator from "./ToggleEventDecorator";
Mvvm.register("toggle", ["*"], ToggleEventDecorator);

import WheelEventDecorator from "./WheelEventDecorator";
Mvvm.register("wheel", ["*"], WheelEventDecorator);

export {};
