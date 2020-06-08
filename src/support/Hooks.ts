import EventHooks from "@/support/EventHooks";
import Nestable from "@/component/Nestable";

interface Hooks {

	getDigestionCycleStartHooks(): EventHooks<Nestable>;

}

export default Hooks;
