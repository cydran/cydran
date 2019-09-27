import { Mvvm } from "../../../Core";

import FormInputEventDecorator from "./FormInputEventDecorator";
Mvvm.register("forminput", ["*"], FormInputEventDecorator);

import FormChangeEventDecorator from "./FormChangeEventDecorator";
Mvvm.register("formchange", ["*"], FormChangeEventDecorator);

import ResetEventDecorator from "./ResetEventDecorator";
Mvvm.register("reset", ["*"], ResetEventDecorator);

import SearchEventDecorator from "./SearchEventDecorator";
Mvvm.register("search", ["*"], SearchEventDecorator);

import SubmitEventDecorator from "./SubmitEventDecorator";
Mvvm.register("submit", ["*"], SubmitEventDecorator);

export {};
