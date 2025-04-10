import { Nestable } from "context/Context";

interface Series {

	getAt<N extends Nestable>(index: number): N;

	replace(oldComponent: Nestable, newComponent: Nestable): void;

	replaceAt(index: number, component: Nestable): void;

	remove(component: Nestable): void;

	removeAt(index: number): void;

	insertBefore(index: number, component: Nestable): void;

	insertAfter(index: number, component: Nestable): void;

	insertFirst(component: Nestable): void;

	insertLast(component: Nestable): void;

	tellComponents(name: string, payload: any): void;

	messageComponents(channelName: string, messageName: string, payload: any): void;

	hasComponents(): boolean;

	contains(component: Nestable): boolean;

	isEmpty(): boolean;

	clear(): void;

}

export default Series;
