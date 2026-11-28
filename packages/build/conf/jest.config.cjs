// Jest configuration for @cydran/build's own unit tests. The sources are ES modules with ".js" import specifiers, so
// ts-jest compiles them to CommonJS and the ".js" suffix is mapped away.
module.exports = {
	rootDir: "..",
	roots: ["<rootDir>/test"],
	testMatch: ["**/*.spec.ts"],
	testEnvironment: "node",
	transform: {
		"^.+\\.ts$": ["ts-jest", { tsconfig: { module: "commonjs", moduleResolution: "node", esModuleInterop: true, types: ["node", "jest"] } }]
	},
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1"
	}
};
