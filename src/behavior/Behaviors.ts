import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";
import Context from "context/Context";

interface Behaviors extends Tellable {

	add(behavior: Behavior<any, HTMLElement | Text, any>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

	message(channelName: string, messageName: string, payload?: any): void;

	setContext(context: Context): void;

}

export default Behaviors;
