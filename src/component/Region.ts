import { Nestable } from "interface/ComponentInterfaces";

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	tellComponent(name: string, payload: any): void;

	messageComponent(channelName: string, messageName: string, payload: any): void;

	hasComponent(): boolean;

}

export default Region;
