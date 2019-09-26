import { Mvvm } from "../../../Core";

import AfterPrintEventDecorator from "./AfterPrintEventDecorator";
import BeforePrintEventDecorator from "./BeforePrintEventDecorator";

Mvvm.register("afterprint", ["*"], AfterPrintEventDecorator);
Mvvm.register("beforeprint", ["*"], BeforePrintEventDecorator);

export {};
