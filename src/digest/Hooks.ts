import EventHooks from "@/event/EventHooks";
import Nestable from "@/interface/ables/Nestable";

interface Hooks {

	getDigestionCycleStartHooks(): EventHooks<Nestable>;

}

export default Hooks;
