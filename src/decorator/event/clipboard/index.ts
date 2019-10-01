import { Mvvm } from "../../../Core";

import Copy from "./Copy";
Mvvm.register("copy", ["*"], Copy);

import Cut from "./Cut";
Mvvm.register("cut", ["*"], Cut);

import Paste from "./Paste";
Mvvm.register("paste", ["*"], Paste);


export {};
