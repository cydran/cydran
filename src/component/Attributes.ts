interface Attributes {

	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isBehaviorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractBehaviorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;

}

export default Attributes;
