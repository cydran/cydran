import Nestable from "interface/ables/Nestable";
import EventHooks from "event/EventHooks";

interface Hooks {

	getDigestionCycleStartHooks(): EventHooks<Nestable>;

}

export default Hooks;
