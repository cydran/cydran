import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import BehaviorSource from "behavior/BehaviorSource";
import Validators from "validator/Validators";
import Messagable from "interface/ables/Messagable";

interface Behavior<M, E extends HTMLElement | Text, P> extends Disposable, BehaviorSource, Tellable, Messagable {

	onInit(): void;

	onPopulate(): void;

	onMount(): void;

	onRemount(): void;

	onUnmount(): void;

	onDispose(): void;

	onValidate(el: E, fn: (name: string, value?: any) => Validators): void;

	isFlagged(name: string): boolean;

}

export default Behavior;
