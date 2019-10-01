import { Mvvm } from "../../../Core";

import PageHide from "./PageHide";
Mvvm.register("pagehide", ["*"], PageHide);

import PageShow from "./PageShow";
Mvvm.register("pageshow", ["*"], PageShow);

import PopState from "./PopState";
Mvvm.register("popstate", ["*"], PopState);

export {};
