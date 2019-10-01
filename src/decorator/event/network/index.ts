import { Mvvm } from "../../../Core";

import Close from "./Close";
Mvvm.register("close", ["*"], Close);

import Offline from "./Offline";
Mvvm.register("offline", ["*"], Offline);

import Online from "./Online";
Mvvm.register("online", ["*"], Online);

import Open from "./Open";
Mvvm.register("open", ["*"], Open);

export {};
