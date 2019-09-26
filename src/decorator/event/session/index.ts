import { Mvvm } from "../../../Core";

import PopStateEventDecorator from "./PopStateEventDecorator";
import PageShowEventDecorator from "./PageShowEventDecorator";
import PageHideEventDecorator from "./PageHideEventDecorator";

Mvvm.register("popstate", ["*"], PopStateEventDecorator);
Mvvm.register("pageshow", ["*"], PageShowEventDecorator);
Mvvm.register("pagehide", ["*"], PageHideEventDecorator);

export {};
