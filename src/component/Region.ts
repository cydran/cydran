import Nestable from "interface/ables/Nestable";

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	tellComponent(name: string, payload: any): void;

	message(channelName: string, messageName: string, payload: any): void;

	hasComponent(): boolean;

}

export default Region;
