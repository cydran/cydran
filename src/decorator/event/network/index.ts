import { Mvvm } from "../../../Core";

import OpenEventDecorator from "./OpenEventDecorator";
import OnlineEventDecorator from "./OnlineEventDecorator";
import OfflineEventDecorator from "./OfflineEventDecorator";
import CloseEventDecorator from "./CloseEventDecorator";

Mvvm.register("online", ["*"], OnlineEventDecorator);
Mvvm.register("offline", ["*"], OfflineEventDecorator);
Mvvm.register("open", ["*"], OpenEventDecorator);
Mvvm.register("close", ["*"], CloseEventDecorator);

export {};
