import { Mvvm } from "../../../Core";

import PageHideEventDecorator from "./PageHideEventDecorator";
Mvvm.register("pagehide", ["*"], PageHideEventDecorator);

import PageShowEventDecorator from "./PageShowEventDecorator";
Mvvm.register("pageshow", ["*"], PageShowEventDecorator);

import PopStateEventDecorator from "./PopStateEventDecorator";
Mvvm.register("popstate", ["*"], PopStateEventDecorator);

export {};
