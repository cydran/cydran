# Sandbox
An SPA for testing and exploring the Cydran framework

## End-to-end (e2e) tests (Playwright)

The sandbox doubles as an e2e test harness. The **Specimens** pages (`/#/specimens`) each
demonstrate one framework feature, and the Playwright specs in `e2e/` drive them and assert the
resulting DOM behavior and state, as well as test other areas of the framework.

### Prerequisites

1. Install workspace dependencies from the **monorepo root**:

   ```shell
   npm run install
   ```

2. Build the framework the sandbox imports (from the monorepo root). The dev server compiles the
   sandbox on the fly, but still needs `@cydran/cydran`'s built output (and `@cydran/build` must be
   built before it — `npm run build` handles the ordering):

   ```shell
   npm run build
   ```

3. Install the Playwright browsers (one-time, from `packages/sandbox`). Installs Chromium, Firefox,
   and WebKit:

   ```shell
   npm run test.e2e.install
   ```

### Running the tests

From `packages/sandbox`:

```shell
npm run test.e2e       # run the suite (chromium + firefox; webkit only in CI or with INCLUDE_WEBKIT=1)
npm run test.e2e.ui    # open the Playwright UI runner (watch / inspect / time-travel)
```

By default the suite runs **chromium** and **firefox**. **WebKit is excluded locally** — the WebKit
build Playwright ships is "frozen" on some platforms (e.g. mac14-arm64) and cannot load the dev
server there, so every test would time out and the run would stall. WebKit runs automatically in CI
(`process.env.CI`), and can be opted in locally:

```shell
INCLUDE_WEBKIT=1 npm run test.e2e    # add webkit on top of chromium + firefox
```

You do **not** need to start the dev server yourself. Playwright starts `webpack-dev-server` on
`http://localhost:8085` automatically (the `webServer` block in `playwright.config.ts`) and tears it
down when the run finishes. Locally an already-running server on that port is reused; in CI a fresh
one is always started.

Common variations (invoke the Playwright CLI directly):

```shell
npx playwright test --project=chromium                        # a single browser
npx playwright test e2e/if-behavior.spec.ts                   # a single spec file
npx playwright test --project=chromium e2e/if-behavior.spec.ts
npx playwright test -g "c-if"                                 # filter by test title
npx playwright test --debug                                   # step-through debugger
npx playwright show-report                                    # open the last HTML report
```

### Configuration notes (`playwright.config.ts`)

- `testDir` is `e2e/`; specs are named `*.spec.ts`.
- Projects: `chromium` and `firefox` always; `webkit` only when `CI` or `INCLUDE_WEBKIT` is set
  (guarded because the frozen local WebKit build can't load the app on some platforms).
- `baseURL` is `http://localhost:8085` (mirrors `webpack.config.js` `devServer`).
- `retries: 2` — the app renders client-side, so a control's event listener can occasionally lose a
  race with a synthetic input event while the shared dev server is under parallel load.
  Retries absorb these occurances.  That being said, a genuine failure still fails every attempt.
  Playwright reports a retried-then-passed test as **flaky**, so any instability stays visible and
  future review and improvements can happen in future releases of Cydran.

### Writing a new e2e test

Tests follow a specimen-driven pattern:

1. Add a specimen component under `src/component/specimens/` (a `Component` subclass + `.html`
   template) and register it in `src/component/specimens/index.ts`
   (`context.registerPrototype("<id>", <Specimen>)`).
2. Add a nav entry (or repurpose a `notyetimplemented` one) in `src/component/SpecimensHome.ts` so
   the specimen is reachable from the Specimens page.
3. Give the test stable hooks: `data-testid` attributes on the elements you assert, and `{{ }}`
   interpolation "mirrors" so model state is observable from the DOM.
4. Write the spec in `e2e/`, navigating **Specimens** link → the specimen's nav title, then assert
   via `getByTestId(...)`.

### Troubleshooting

- **A run fails immediately, or serves stale content across rapid back-to-back runs.** Because
  `reuseExistingServer` is enabled locally, a lingering `webpack-dev-server` from a previous run can
  be reused and serve an out-of-date bundle. Free the port and re-run:

  ```shell
  lsof -ti tcp:8085 | xargs kill -9
  ```

- **`ERR_OSSL_EVP_UNSUPPORTED`** during the webpack build — see Known Issues below.

## Known Issues

### Webpack build failing with ERR_OSSL_EVP_UNSUPPORTED

Including the Node option to use the OpenSSL legacy provider can solve this problem.

Executing the following command line will configure this in Node:

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

See [Webpack build failing with ERR_OSSL_EVP_UNSUPPORTED [duplicate]](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported) for more details.
