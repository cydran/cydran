import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";

interface Behaviors extends Tellable, Disposable {

	add(behavior: Behavior<any, HTMLElement | Text, any>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default Behaviors;
