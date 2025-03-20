import { Nestable } from "context/Context";

interface Series {

	getAt<N extends Nestable>(index: number): N;

	replaceAt(index: number, component: Nestable): void;

	remove(component: Nestable): void;

	removeAt(index: number): void;

	addAt(index: number, component: Nestable): void;

	addAsFirst(component: Nestable): void;

	addAsLast(component: Nestable): void;

	tellComponents(name: string, payload: any): void;

	messageComponents(channelName: string, messageName: string, payload: any): void;

	hasComponents(): boolean;

	isEmpty(): boolean;

	clear(): void;

}

export default Series;
