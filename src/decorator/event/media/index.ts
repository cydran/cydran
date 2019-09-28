import { Mvvm } from "../../../Core";

import CanPlayEventDecorator from "./CanPlayEventDecorator";
Mvvm.register("canplay", ["*"], CanPlayEventDecorator);

import CanPlayThroughEventDecorator from "./CanPlayThroughEventDecorator";
Mvvm.register("canplaythrough", ["*"], CanPlayThroughEventDecorator);

import DurationChangeEventDecorator from "./DurationChangeEventDecorator";
Mvvm.register("durationchange", ["*"], DurationChangeEventDecorator);

import EmptiedEventDecorator from "./EmptiedEventDecorator";
Mvvm.register("emptied", ["*"], EmptiedEventDecorator);

import EndedEventDecorator from "./EndedEventDecorator";
Mvvm.register("ended", ["*"], EndedEventDecorator);

import LoadedDataEventDecorator from "./LoadedDataEventDecorator";
Mvvm.register("loadeddata", ["*"], LoadedDataEventDecorator);

import LoadedMetaDataEventDecorator from "./LoadedMetaDataEventDecorator";
Mvvm.register("loadedmetadata", ["*"], LoadedMetaDataEventDecorator);

import LoadStartEventDecorator from "./LoadStartEventDecorator";
Mvvm.register("loadstart", ["*"], LoadStartEventDecorator);

import PauseEventDecorator from "./PauseEventDecorator";
Mvvm.register("pause", ["*"], PauseEventDecorator);

import PlayEventDecorator from "./PlayEventDecorator";
Mvvm.register("play", ["*"], PlayEventDecorator);

import PlayingEventDecorator from "./PlayingEventDecorator";
Mvvm.register("playing", ["*"], PlayingEventDecorator);

import ProgressEventDecorator from "./ProgressEventDecorator";
Mvvm.register("progress", ["*"], ProgressEventDecorator);

import RateChangeEventDecorator from "./RateChangeEventDecorator";
Mvvm.register("ratechange", ["*"], RateChangeEventDecorator);

import SeekedEventDecorator from "./SeekedEventDecorator";
Mvvm.register("seeked", ["*"], SeekedEventDecorator);

import SeekingEventDecorator from "./SeekingEventDecorator";
Mvvm.register("seeking", ["*"], SeekingEventDecorator);

import StalledEventDecorator from "./StalledEventDecorator";
Mvvm.register("stalled", ["*"], StalledEventDecorator);

import SuspendEventDecorator from "./SuspendEventDecorator";
Mvvm.register("suspend", ["*"], SuspendEventDecorator);

import TimeUpdateEventDecorator from "./TimeUpdateEventDecorator";
Mvvm.register("timeupdate", ["*"], TimeUpdateEventDecorator);

import VolumeChangeEventDecorator from "./VolumeChangeEventDecorator";
Mvvm.register("volumechange", ["*"], VolumeChangeEventDecorator);

import WaitingEventDecorator from "./WaitingEventDecorator";
Mvvm.register("waiting", ["*"], WaitingEventDecorator);

export { };
