import { Mvvm } from "../../../Core";

import FullScreenChange from "./FullScreenChange";
Mvvm.register("fullscreenchange", ["*"], FullScreenChange);

import FullScreenError from "./FullScreenError";
Mvvm.register("fullscreenerror", ["*"], FullScreenError);

import Resize from "./Resize";
Mvvm.register("resize", ["*"], Resize);

import Scroll from "./Scroll";
Mvvm.register("scroll", ["*"], Scroll);

export {};
