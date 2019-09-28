import { Mvvm } from "../../../Core";

import AfterPrintEventDecorator from "./AfterPrintEventDecorator";
Mvvm.register("afterprint", ["*"], AfterPrintEventDecorator);

import BeforePrintEventDecorator from "./BeforePrintEventDecorator";
Mvvm.register("beforeprint", ["*"], BeforePrintEventDecorator);

export {};
