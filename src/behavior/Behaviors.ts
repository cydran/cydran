import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";

interface Behaviors extends Tellable {

	add(behavior: Behavior<any, HTMLElement | Text, any>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

	message(channelName: string, messageName: string, payload?: any): void;

}

export default Behaviors;
