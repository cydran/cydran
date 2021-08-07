import { requireNotNull, extractAttribute } from "util/Utils";
import AttributeExtractor from "component/AttributeExtractor";

class AttributeExtractorImpl implements AttributeExtractor {
	private prefix: string;

	private eventPrefix: string;

	constructor(prefix: string) {
		this.prefix = `${requireNotNull(prefix, "prefix")}:`;
		this.eventPrefix = `${this.prefix}on`;
	}

	public extract(element: HTMLElement, name: string): string {
		return extractAttribute(element, this.prefix, name);
	}

	public remove(element: HTMLElement, name: string): void {
		element.removeAttribute(this.prefix + name);
	}

	public isEventAttribute(name: string): boolean {
		return name.indexOf(this.eventPrefix) === 0;
	}

	public isBehaviorAttribute(name: string): boolean {
		return name.indexOf(this.prefix) === 0;
	}

	public extractEventName(name: string): string {
		return name.substr(this.eventPrefix.length);
	}

	public extractBehaviorName(name: string): string {
		return name.substr(this.prefix.length);
	}

	public asTypePrefix(name: string): string {
		return this.prefix + name;
	}

	public getPrefix(): string {
		return this.prefix;
	}
}

export default AttributeExtractorImpl;