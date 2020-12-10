import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";
import Messagable from 'interface/ables/Messagable';

interface Behaviors extends Tellable, Disposable, Messagable {

	add(behavior: Behavior<any, HTMLElement | Text, any>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default Behaviors;
