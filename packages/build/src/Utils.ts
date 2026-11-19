import fs from "fs";

function requireNotNull(value, name) {
	if (value === null || value === undefined) {
		throw new Error(name + " shall not be null");
	}

	return value;
}

function isDefined(value) {
	return value !== null && value !== undefined;
}

function loadJson(filePath) {
	const json = fs.readFileSync(filePath);
	const object = JSON.parse(json + '');
	
	return object;
}

export { requireNotNull, isDefined, loadJson };
