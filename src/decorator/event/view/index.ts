import { Mvvm } from "../../../Core";

import FullScreenChangeEventDecorator from "./FullScreenChangeEventDecorator";
Mvvm.register("fullscreenchange", ["*"], FullScreenChangeEventDecorator);

import FullScreenErrorEventDecorator from "./FullScreenErrorEventDecorator";
Mvvm.register("fullscreenerror", ["*"], FullScreenErrorEventDecorator);

import ResizeEventDecorator from "./ResizeEventDecorator";
Mvvm.register("resize", ["*"], ResizeEventDecorator);

import ScrollEventDecorator from "./ScrollEventDecorator";
Mvvm.register("scroll", ["*"], ScrollEventDecorator);

export {};
