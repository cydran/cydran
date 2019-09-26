import { Mvvm } from "../../../Core";

import ResetEventDecorator from "./ResetEventDecorator";
import SubmitEventDecorator from "./SubmitEventDecorator";
import FormInputEventDecorator from "./FormInputEventDecorator";
import FormChangeEventDecorator from "./FormChangeEventDecorator";
import SearchEventDecorator from "./SearchEventDecorator";

Mvvm.register("reset", ["*"], ResetEventDecorator);
Mvvm.register("submit", ["*"], SubmitEventDecorator);
Mvvm.register("search", ["*"], SearchEventDecorator);
Mvvm.register("formchange", ["*"], FormChangeEventDecorator);
Mvvm.register("forminput", ["*"], FormInputEventDecorator);

export {};
