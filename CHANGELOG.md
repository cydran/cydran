# Changelog

All notable changes to Cydran are documented in this file.

## [0.5.1](https://github.com/cydran/cydran/compare/v0.5.0...v0.5.1) (2026-10-21)

24 pull requests plus one direct commit, closing 18 issues. This release focuses on callback lifetime (weak-reference) bugs, a new public registration API, `c-each` item values, component readiness guarding, and a browser-driven end-to-end test suite.

### Breaking changes

- **Callbacks are registered by method name** ([#816](https://github.com/cydran/cydran/issues/816), PR [#836](https://github.com/cydran/cydran/pull/836)). The public callback-registration APIs take the name of a method on a target object instead of a function. Inline closures are no longer accepted.
  - Reactive watch: `Mediator.watch(thisObject, name)`. From a component, `$c().onExpressionValueChange(expression).invoke(name)`, with an optional `.reducedBy(reducerFn)` before `.invoke`. It takes no target; the method is resolved on the component ([#840](https://github.com/cydran/cydran/issues/840), PR [#841](https://github.com/cydran/cydran/pull/841)).
  - Messaging: `$c().onMessage(...).forChannel(...).invoke(name)`.
  - Intervals: `$c().onInterval(...).invoke(name)`.
  - Property observers: `add/removeObserver`, `add/removePropertyObserver`, and `add/removeFallbackObserver` take `(thisObject, name)`. The injected `PropertySubscriber` and `PropertyFallBackSubscriber` types are now `(thisObject, name) => void` and no longer generic.
  - A name that isn't a method on the target throws the new `UnknownMethodError`. A missing target or name throws `NullValueError`, and a non-string name throws `InvalidTypeError`.
  - Lifecycle `addInitializer` / `addPreInitializer` / `addDisposer` are unchanged and still take a callback.
  - Migration: `(this, this.foo)` → `(this, "foo")`; `.invoke(this.foo)` → `.invoke("foo")`; `onExpressionValueChange(expr, this.foo)` → `onExpressionValueChange(expr).invoke("foo")`.
- **`$c()` is no longer a `Watchable`** ([#840](https://github.com/cydran/cydran/issues/840), PR [#841](https://github.com/cydran/cydran/pull/841)). `$c().getWatchScope()` is removed and the `Watchable` type is no longer exported. Both were internal to filters. `$c().evaluate(...)` is unchanged.
- **`$c()` methods that need a ready component throw `ComponentReadinessError`** when called too early ([#800](https://github.com/cydran/cydran/issues/800), PR [#806](https://github.com/cydran/cydran/pull/806)). This applies to `regions()`, `forSeries()`, `forElement()`, `forForm()`, `forForms()`, and `properties()`. Call them from `onMount`, not the constructor.

### Fixes

- **Reactive bindings and handlers stopped working after garbage collection** ([#832](https://github.com/cydran/cydran/issues/832), PR [#834](https://github.com/cydran/cydran/pull/834)). Several behaviors (`c-model`, `c-checked`, `c-focus`, multi-select) and filters registered inline closures that were held only by weak references. Once collected, the handler silently stopped firing. The closures are now retained, with forced-GC regression tests.
  - **[#825](https://github.com/cydran/cydran/issues/825)** (`c-model` intermittently dropped an early input) and **[#826](https://github.com/cydran/cydran/issues/826)** (`c-focus` focus trap intermittently failed to re-focus) were this same bug. Both fail every time under forced GC on the code before PR [#834](https://github.com/cydran/cydran/pull/834) and pass after it. PRs [#837](https://github.com/cydran/cydran/pull/837) and [#838](https://github.com/cydran/cydran/pull/838) add regression tests for them. No further framework change was needed.
- **Lifecycle callbacks are held strongly** ([#814](https://github.com/cydran/cydran/issues/814), PR [#835](https://github.com/cydran/cydran/pull/835)). Pre-initializers, initializers, and disposers are kept in a plain list until they run, then cleared, instead of in a weak-reference set.
- **`c-each` item `v()` went stale after same-key replacement** ([#812](https://github.com/cydran/cydran/issues/812), PR [#839](https://github.com/cydran/cydran/pull/839)). When the array got a new object with the same key (for example `items.map(i => ({ ...i }))`), the item kept rendering the old object, and `c-model` / `c-checked` on `v()` wrote to a detached copy. Reused item components now point at the current object. PR [#839](https://github.com/cydran/cydran/pull/839) also adds broad `v()` coverage across binding contexts and both id modes.
- **`c-model` on radio inputs** used the wrong behavior ([#830](https://github.com/cydran/cydran/issues/830), PR [#833](https://github.com/cydran/cydran/pull/833)). The `model:input` behavior factory now correctly selects `RadioModelBehavior`.
- **Garbage collection tests** were broken, and fixing them uncovered a bug that was also fixed ([#796](https://github.com/cydran/cydran/issues/796), PR [#803](https://github.com/cydran/cydran/pull/803)).
- **Sandbox routing** was broken ([#807](https://github.com/cydran/cydran/issues/807), PR [#809](https://github.com/cydran/cydran/pull/809), "Fixed over-eager garbage collection issues").
- **Forms integration test** was skipped because it failed ([#795](https://github.com/cydran/cydran/issues/795), PR [#798](https://github.com/cydran/cydran/pull/798)).

### Testing and sandbox

- **Browser-driven end-to-end suite** ([#818](https://github.com/cydran/cydran/issues/818)). The sandbox was reorganized into specimens (PR [#819](https://github.com/cydran/cydran/pull/819)). Playwright support was added (PR [#820](https://github.com/cydran/cydran/pull/820)) with Firefox and WebKit projects (PR [#821](https://github.com/cydran/cydran/pull/821)), and specimen stubs were added along with a `FactoryImpl` typo fix (PR [#822](https://github.com/cydran/cydran/pull/822)). Behavior e2e tests (PR [#827](https://github.com/cydran/cydran/pull/827)) and integration tests for series, `c-each`, errors, select, and radio (PRs [#828](https://github.com/cydran/cydran/pull/828), [#831](https://github.com/cydran/cydran/pull/831)) round it out.
- New specimens and specs guard the fixes above: forced-GC tests (PR [#834](https://github.com/cydran/cydran/pull/834)), Race Diagnostic (PR [#837](https://github.com/cydran/cydran/pull/837)), c-focus retention (PR [#838](https://github.com/cydran/cydran/pull/838)), and Each Item Values (PR [#839](https://github.com/cydran/cydran/pull/839)). PR [#841](https://github.com/cydran/cydran/pull/841) adds unit tests and a `continuation-watch` integration test for the fluent `onExpressionValueChange`.
- Integration test cleanup before release ([#810](https://github.com/cydran/cydran/issues/810), PR [#811](https://github.com/cydran/cydran/pull/811)).

### Build and CI

- GitHub Actions workflow creates a GitHub release when a release tag is created ([#729](https://github.com/cydran/cydran/issues/729), PR [#805](https://github.com/cydran/cydran/pull/805)).
- Workflow permissions tightened ([#797](https://github.com/cydran/cydran/issues/797), PR [#808](https://github.com/cydran/cydran/pull/808)).
- Builds no longer delete the coverage folder ([#793](https://github.com/cydran/cydran/issues/793), PR [#804](https://github.com/cydran/cydran/pull/804)).
- CI updated to Node 26 ([#823](https://github.com/cydran/cydran/issues/823), PR [#824](https://github.com/cydran/cydran/pull/824)).

### Other

- [`f38b3a53`](https://github.com/cydran/cydran/commit/f38b3a53df003af2842d2bf74638e85abd7f066a): removed a file that was added by mistake.

### Issues closed (18)

[#729](https://github.com/cydran/cydran/issues/729), [#793](https://github.com/cydran/cydran/issues/793), [#795](https://github.com/cydran/cydran/issues/795), [#796](https://github.com/cydran/cydran/issues/796), [#797](https://github.com/cydran/cydran/issues/797), [#800](https://github.com/cydran/cydran/issues/800), [#807](https://github.com/cydran/cydran/issues/807), [#810](https://github.com/cydran/cydran/issues/810), [#812](https://github.com/cydran/cydran/issues/812), [#814](https://github.com/cydran/cydran/issues/814), [#816](https://github.com/cydran/cydran/issues/816), [#818](https://github.com/cydran/cydran/issues/818), [#823](https://github.com/cydran/cydran/issues/823), [#825](https://github.com/cydran/cydran/issues/825), [#826](https://github.com/cydran/cydran/issues/826), [#830](https://github.com/cydran/cydran/issues/830), [#832](https://github.com/cydran/cydran/issues/832), [#840](https://github.com/cydran/cydran/issues/840)
