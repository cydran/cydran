const fs = require('fs');
const path = require('path');

const SUFFIX = ".ts";
const TEST_SUFFIX = ".spec.ts";

function walkDirectory(dir, callback) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            walkDirectory(fullPath, callback);
        } else if (stats.isFile()) {
            callback(fullPath);
        }
    }
}

console.log("Checking Unit Tests");

let missingCount = 0;

walkDirectory('./src', (filePath) => {
	const name = filePath.toString().substring(4);

	if (!name.endsWith(SUFFIX)) {
		return;
	}

	const testName = "./test/" + name.slice(0, 0 - SUFFIX.length) + TEST_SUFFIX;

	if (!fs.existsSync(testName)) {
		console.log("Missing test for source file: " + name);
		++missingCount;
	}
});

if (missingCount > 0) {
	console.log();
	console.log("Total missing tests: " + missingCount);
	console.log();
}
