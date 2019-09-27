import { Mvvm } from "../../../Core";

import MessageEventDecorator from "./MessageEventDecorator";
Mvvm.register("message", ["*"], MessageEventDecorator);

export {};
