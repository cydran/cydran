import { Mvvm } from "../../../Core";

import CanPlay from "./CanPlay";
Mvvm.register("canplay", ["*"], CanPlay);

import CanPlayThrough from "./CanPlayThrough";
Mvvm.register("canplaythrough", ["*"], CanPlayThrough);

import DurationChange from "./DurationChange";
Mvvm.register("durationchange", ["*"], DurationChange);

import Emptied from "./Emptied";
Mvvm.register("emptied", ["*"], Emptied);

import Ended from "./Ended";
Mvvm.register("ended", ["*"], Ended);

import LoadedData from "./LoadedData";
Mvvm.register("loadeddata", ["*"], LoadedData);

import LoadedMetaData from "./LoadedMetaData";
Mvvm.register("loadedmetadata", ["*"], LoadedMetaData);

import LoadStart from "./LoadStart";
Mvvm.register("loadstart", ["*"], LoadStart);

import Pause from "./Pause";
Mvvm.register("pause", ["*"], Pause);

import Play from "./Play";
Mvvm.register("play", ["*"], Play);

import Playing from "./Playing";
Mvvm.register("playing", ["*"], Playing);

import Progress from "./Progress";
Mvvm.register("progress", ["*"], Progress);

import RateChange from "./RateChange";
Mvvm.register("ratechange", ["*"], RateChange);

import Seeked from "./Seeked";
Mvvm.register("seeked", ["*"], Seeked);

import Seeking from "./Seeking";
Mvvm.register("seeking", ["*"], Seeking);

import Stalled from "./Stalled";
Mvvm.register("stalled", ["*"], Stalled);

import Suspend from "./Suspend";
Mvvm.register("suspend", ["*"], Suspend);

import TimeUpdate from "./TimeUpdate";
Mvvm.register("timeupdate", ["*"], TimeUpdate);

import VolumeChange from "./VolumeChange";
Mvvm.register("volumechange", ["*"], VolumeChange);

import Waiting from "./Waiting";
Mvvm.register("waiting", ["*"], Waiting);

export { };
