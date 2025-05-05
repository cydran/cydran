import { Nestable } from "context/Context";

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	tellComponent(name: string, payload: unknown): void;

	messageComponent(channelName: string, messageName: string, payload: unknown): void;

	hasComponent(): boolean;

}

export default Region;
