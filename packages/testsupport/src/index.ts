import Harness from 'harness/Harness';

function isDefined(value: any): boolean {
	return value !== null && value !== undefined;
}

function requireNotNull<T>(value: T, name: string): T {
	if (value === null || value === undefined) {
		throw new Error(`${ name } shall not be null`);
	}

	return value;
}

function merge<T>(sources: any[]): T {
	requireNotNull(sources, "sources");

	return overlay({} as T, sources);
}

function overlay<T>(destination: T, sources: any[]): T {
	requireNotNull(destination, "destination");
	requireNotNull(sources, "sources");

	for (const source of sources) {
		if (!isDefined(source)) {
			continue;
		}

		for (const name in source) {
			if (!source.hasOwnProperty(name)) {
				continue;
			}

			if (!isDefined(source[name])) {
				continue;
			}

			destination[name] = source[name];
		}
	}

	return destination;
}

export {
	Harness, overlay, merge, requireNotNull, isDefined
};
