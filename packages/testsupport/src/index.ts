import Harness from 'harness/Harness';

function isDefined<T>(value: T): boolean {
	return value !== null && value !== undefined;
}

function requireNotNull<T>(value: T, name: string): T {
	if (value === null || value === undefined) {
		throw new Error(`${ name } shall not be null`);
	}

	return value;
}

function merge<T>(sources: unknown[]): T {
	requireNotNull(sources, "sources");

	return overlay({} as T, sources);
}

function overlay<T>(destination: T, sources: unknown[]): T {
	requireNotNull(destination, "destination");
	requireNotNull(sources, "sources");

	for (const source of sources) {
		if (!isDefined(source)) {
			continue;
		}

		for (const name in source as Object) {
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
