import { requireNotNull } from "@/util/ObjectUtils";
import { extractAttribute } from "@/util/DomUtils";
import AttributeExtractor from "@/mvvm/AttributeExtractor";

class AttributeExtractorImpl implements AttributeExtractor {

	private prefix: string;

	private eventPrefix: string;

	constructor(prefix: string) {
		this.prefix = requireNotNull(prefix, "prefix") + ":";
		this.eventPrefix = this.prefix + "on";
	}

	public extract(element: HTMLElement, name: string): string {
		return extractAttribute(element, this.prefix, name);
	}

	public remove(element: HTMLElement, name: string): void {
		element.removeAttribute(this.prefix + name);
	}

	public isEventAttribute(name: string): boolean {
		return (name.indexOf(this.eventPrefix ) === 0);
	}

	public isMediatorAttribute(name: string): boolean {
		return (name.indexOf(this.prefix) === 0);
	}

	public extractEventName(name: string): string {
		return name.substr(this.eventPrefix.length);
	}

	public extractMediatorName(name: string): string {
		return name.substr(this.prefix.length);
	}

	public asTypePrefix(name: string): string {
		return this.prefix + name;
	}

}

export default AttributeExtractorImpl;
