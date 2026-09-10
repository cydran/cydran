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

/**
 * WebKit guard: the WebKit build Playwright ships is "frozen" on some local platforms
 * (e.g. mac14-arm64), where it cannot even `page.goto` the dev server — every test then
 * times out (30s) and, with retries, the full run stalls for ~an hour. So WebKit is
 * excluded by default and only included in CI (fresh builds) or when explicitly opted in
 * via INCLUDE_WEBKIT=1. Chromium + Firefox always run.
 */
const includeWebkit: boolean = !!process.env.CI || !!process.env.INCLUDE_WEBKIT;

const projects = [
	{
		name: "chromium",
		use: { ...devices["Desktop Chrome"] },
	},
	{
		name: "firefox",
		use: { ...devices["Desktop Firefox"] },
	},
];

if (includeWebkit) {
	projects.push({
		name: "webkit",
		use: { ...devices["Desktop Safari"] },
	});
}

export default defineConfig({
	testDir: "./e2e",
	// Fail the build if a `test.only` is committed by accident.
	forbidOnly: !!process.env.CI,
	// Retries absorb transient flakes where a DOM event races Cydran's client-side
	// listener attachment while the shared dev server is under parallel load: a retried
	// test re-runs fresh against a now-warm server, while a genuine failure still fails
	// deterministically (twice) and is reported. Playwright still flags retried-then-passed
	// tests as "flaky", preserving visibility.
	retries: 2,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: BASE_URL,
		// Capture a trace on the first retry to aid debugging failures.
		trace: "on-first-retry",
	},
	projects: projects,
	webServer: {
		// Same as `npm start` but without `--open`, which would try to launch a
		// system browser and is undesirable in CI / automated runs.
		command: "npx webpack-dev-server --config=webpack.config.js --mode development",
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	}
});
