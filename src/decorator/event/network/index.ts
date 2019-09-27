import { Mvvm } from "../../../Core";

import CloseEventDecorator from "./CloseEventDecorator";
Mvvm.register("close", ["*"], CloseEventDecorator);

import OfflineEventDecorator from "./OfflineEventDecorator";
Mvvm.register("offline", ["*"], OfflineEventDecorator);

import OnlineEventDecorator from "./OnlineEventDecorator";
Mvvm.register("online", ["*"], OnlineEventDecorator);

import OpenEventDecorator from "./OpenEventDecorator";
Mvvm.register("open", ["*"], OpenEventDecorator);

export {};
