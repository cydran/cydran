import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Cydran sandbox.
 *
 * The dev server (webpack-dev-server) is started automatically by Playwright via
 * the `webServer` block below and torn down when the run finishes. Locally an
 * already-running server on the same port is reused; in CI a fresh one is always
 * started. The port/host mirror `webpack.config.js` (`devServer`).
 */
const HOST = "localhost";
const PORT = 8085;
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
	testDir: "./e2e",
	// Fail the build if a `test.only` is committed by accident.
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: BASE_URL,
		// Capture a trace on the first retry to aid debugging failures.
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		},
	],
	webServer: {
		// Same as `npm start` but without `--open`, which would try to launch a
		// system browser and is undesirable in CI / automated runs.
		command: "npx webpack-dev-server --config=webpack.config.js --mode development",
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	}
});
