function extractParams<T>(tagName: string, el: HTMLElement): T {
	const result: any = {};

	// tslint:disable-next-line
	for (let i = 0; i < el.children.length; i++) {
		const child: HTMLElement = el.children[i] as HTMLElement;

		if (child.tagName.toLowerCase() === tagName.toLowerCase()) {
			const paramName: string = child.getAttribute("name");
			const paramValue: string = child.getAttribute("value");
			result[paramName] = paramValue;
		}
	}

	return result;
}

function extractAttributes<T>(prefix: string, el: HTMLElement): T {
	const result: any = {};
	const lowerCasePrefix: string = prefix.toLowerCase() + ":";

	// tslint:disable-next-line
	for (let i = 0; i < el.attributes.length; i++) {
		const attribute: Attr = el.attributes[i] as Attr;

		const name: string = attribute.name.toLowerCase();

		if (name.indexOf(lowerCasePrefix) === 0) {
			const paramName: string = name.slice(lowerCasePrefix.length);
			const paramValue: string = attribute.value;
			result[paramName] = paramValue;
		}
	}

	return result;
}

export { extractParams, extractAttributes };
