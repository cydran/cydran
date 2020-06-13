import Hooks from "@/support/Hooks";
import Nestable from "@/component/Nestable";
import EventHooks from "@/support/EventHooks";
import DigesterImpl from "@/mvvm/DigesterImpl";

class HooksImpl implements Hooks {

	public static readonly INSTANCE: Hooks = new HooksImpl();

	public getDigestionCycleStartHooks(): EventHooks<Nestable> {
		return DigesterImpl.DIGESTION_CYCLE_START_HOOKS;
	}

}

export default HooksImpl;
