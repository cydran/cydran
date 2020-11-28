// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = async () => {
	return {
		clearMocks: true,
		collectCoverage: process.env.cover ? !!process.env.cover : false,
		coverageDirectory: "coverage",
		rootDir: process.env.integration ? "integration" : "test",
		testMatch: process.env.integration
			? ["**/?(*.)+(integration-spec).[tj]s?(x)"]
			: ["**/?(*.)+(spec|test).[tj]s?(x)"],
		verbose: true,
	};
};
