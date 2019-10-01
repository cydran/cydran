import { Mvvm } from "../../../Core";

import FormInput from "./FormInput";
Mvvm.register("forminput", ["*"], FormInput);

import FormChange from "./FormChange";
Mvvm.register("formchange", ["*"], FormChange);

import Reset from "./Reset";
Mvvm.register("reset", ["*"], Reset);

import Search from "./Search";
Mvvm.register("search", ["*"], Search);

import Submit from "./Submit";
Mvvm.register("submit", ["*"], Submit);

export {};
