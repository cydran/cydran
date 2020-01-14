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


export { extractParams };
