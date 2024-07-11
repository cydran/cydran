import { PrefixMismatchError } from "error/Errors";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { isDefined, requireNotNull, startsWith } from "util/Utils";

function propertyMapGenerator(preferredKey: string, prefix: string): AdvancedMap<string[]> {
	requireNotNull(preferredKey, "preferredKey");

	let result: AdvancedMap<string[]> = null;

	if (!isDefined(prefix)) {
		result = createWithoutPrefix(preferredKey);
	} else if (preferredKey === prefix) {
		result = new AdvancedMapImpl<string[]>();
		result.put(preferredKey, []);
	} else {
		result = createWithPrefix(prefix, preferredKey);
	}

	return result;
}

function createWithPrefix(prefix: string, targetKey: string): AdvancedMap<string[]> {
	if (!startsWith(targetKey, prefix + ".")) {
		throw new PrefixMismatchError("preferredKey must start with the prefix");
	}

	const result: AdvancedMap<string[]> = new AdvancedMapImpl<string[]>();
	const trimmedKey: string = targetKey.substring((prefix + ".").length);
	const keySegments: string[] = trimmedKey.split(".");

	if (keySegments.length == 1) {
		result.put(prefix + "." + keySegments[0], [])
		return result;
	}

	const baseKey: string = keySegments.pop();
	const keys: string[] = [];

	while (keySegments.length > 0) {
		const key: string = keySegments.join(".");
		const currentKey: string = key + "." + baseKey;
		keys.unshift(currentKey);
		keySegments.pop();
	}

	keys.unshift(baseKey);

	while (keys.length > 0) {
		const key: string = keys.shift();
		const values: string[] = keys.slice();
		result.put( prefix + "." + key, appendPrefix(prefix, values));
	}

	return result;
}

function createWithoutPrefix(targetKey: string): AdvancedMap<string[]> {
	const result: AdvancedMap<string[]> = new AdvancedMapImpl<string[]>();
	const keySegments: string[] = targetKey.split(".");

	if (keySegments.length < 2) {
		result.put(targetKey, []);
		return result;
	}

	const baseKey: string = keySegments.pop();
	const keys: string[] = [];

	while (keySegments.length > 0) {
		const key: string = keySegments.join(".");
		const currentKey: string = key + "." + baseKey;
		keys.unshift(currentKey);
		keySegments.pop();
	}

	keys.unshift(baseKey);

	while (keys.length > 0) {
		const key: string = keys.shift();
		const values: string[] = keys.slice();
		result.put(key, values);
	}

	return result;
}

function appendPrefix(prefix: string, keys: string[]): string[] {
	const result: string[] = [];

	for (let i = 0; i < keys.length; i++) {
		result.push(prefix + "." + keys[i]);
	}

	return result;
}

export default propertyMapGenerator;