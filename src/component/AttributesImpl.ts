import { requireNotNull, extractAttribute } from "util/Utils";
import Attributes from "component/Attributes";
import { ATTRIBUTE_DELIMITER } from 'const/HardValues';

class AttributeExtractorImpl implements Attributes {

	private prefix: string;

	private eventPrefix: string;

	private delimitedPrefix: string;

	constructor(prefix: string) {
		this.prefix = requireNotNull(prefix, "prefix");
		this.eventPrefix = this.prefix + ATTRIBUTE_DELIMITER + "on";
		this.delimitedPrefix = this.prefix + ATTRIBUTE_DELIMITER;
	}

	public extract(element: HTMLElement, name: string): string {
		return extractAttribute(element, this.prefix, name);
	}

	public remove(element: HTMLElement, name: string): void {
		element.removeAttribute(this.delimitedPrefix + name);
	}

	public isEventAttribute(name: string): boolean {
		return (name.indexOf(this.eventPrefix) === 0) && this.extractEventName(name).indexOf(ATTRIBUTE_DELIMITER) === -1;
	}

	public isBehaviorAttribute(name: string): boolean {
		return (name.indexOf(this.delimitedPrefix) === 0) && this.extractBehaviorName(name).indexOf(ATTRIBUTE_DELIMITER) === -1;
	}

	public extractEventName(name: string): string {
		return name.substr(this.eventPrefix.length);
	}

	public extractBehaviorName(name: string): string {
		return name.substr(this.delimitedPrefix.length);
	}

	public asTypePrefix(name: string): string {
		return this.delimitedPrefix + name;
	}

	public getPrefix(): string {
		return this.prefix;
	}

}

export default AttributeExtractorImpl;
