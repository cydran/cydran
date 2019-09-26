import { Mvvm } from "../../../Core";

import ScrollEventDecorator from "./ScrollEventDecorator";
import ResizeEventDecorator from "./ResizeEventDecorator";
import FullScreenChangeEventDecorator from "./FullScreenChangeEventDecorator";
import FullScreenErrorEventDecorator from "./FullScreenErrorEventDecorator";

Mvvm.register("fullscreenchange", ["*"], FullScreenChangeEventDecorator);
Mvvm.register("fullscreenerror", ["*"], FullScreenErrorEventDecorator);
Mvvm.register("resize", ["*"], ResizeEventDecorator);
Mvvm.register("scroll", ["*"], ScrollEventDecorator);

export {};
