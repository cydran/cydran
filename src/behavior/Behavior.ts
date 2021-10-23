import Tellable from "interface/ables/Tellable";
import BehaviorSource from "behavior/BehaviorSource";
import Messagable from "interface/ables/Messagable";

interface Behavior<M, E extends HTMLElement | Text, P> extends BehaviorSource, Tellable, Messagable {

	onInit(context?: any): void;

	onMount(): void;

	onUnmount(): void;

	onRemount(): void;

	isFlagged(name: string): boolean;

}

export default Behavior;
