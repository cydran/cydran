import { Mvvm } from "../../../Core";

import Message from "./Message";
Mvvm.register("message", ["*"], Message);

export {};
