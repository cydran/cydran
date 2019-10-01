import { Mvvm } from "../../../Core";

import AfterPrint from "./AfterPrint";
Mvvm.register("afterprint", ["*"], AfterPrint);

import BeforePrint from "./BeforePrint";
Mvvm.register("beforeprint", ["*"], BeforePrint);

export {};
