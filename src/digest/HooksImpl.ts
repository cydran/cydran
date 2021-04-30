import Hooks from "digest/Hooks";
import DigesterImpl from "digest/DigesterImpl";
import EventHooks from "event/EventHooks";
import Nestable from "interface/ables/Nestable";

class HooksImpl implements Hooks {
	public static readonly INSTANCE: Hooks = new HooksImpl();

	public getDigestionCycleStartHooks(): EventHooks<Nestable> {
		return DigesterImpl.DIGESTION_CYCLE_START_HOOKS;
	}
}

export default HooksImpl;
