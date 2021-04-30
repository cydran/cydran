interface AttributeExtractor {
	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isMediatorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractMediatorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;
}

export default AttributeExtractor;
