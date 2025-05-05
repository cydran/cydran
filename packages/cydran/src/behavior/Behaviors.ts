import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";
import { Context } from "context/Context";

interface Behaviors extends Tellable {

	add(behavior: Behavior<unknown, HTMLElement | Text, unknown>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

	message(channelName: string, messageName: string, payload?: unknown): void;

	setContext(context: Context): void;

}

export default Behaviors;
