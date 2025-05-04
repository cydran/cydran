import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import IndexedEvaluator from "eval/IndexedEvaluator";
import Watchable from "interface/ables/Watchable";
import Provider from "interface/Provider";
import WatcherImpl from "digest/WatcherImpl";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";
import { asBoolean } from "util/AsFunctions";
import getLogger from "log/getLogger";

class PredicatePhaseImpl extends AbstractPhaseImpl {

	private evaluator: IndexedEvaluator<boolean>;

	private valueFunctions: (() => unknown)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(`Predicate - ${ expression }`, previous);
		requireNotNull(expression, "expression");
		const loggerName: string = `IndexedEvaluator: ${ expression }`;
		this.evaluator = new IndexedEvaluator(expression, watchable.getWatchScope() as ScopeImpl, asBoolean, getLogger("predicatePhase", loggerName));
		this.valueFunctions = [];

		// eslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Provider<unknown> = new WatcherImpl<unknown>(watchable, parameterExpression, getLogger('watcher', `Watcher: ${ parameterExpression }`))
				.addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: unknown[]): unknown[] {
		const result: unknown[] = [];

		this.getLogger().ifTrace(() => this.loggerPayload("Before predicate filtration", items));

		// eslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: unknown = items[i];

			if (this.evaluator.test(current, i, this.valueFunctions)) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => this.loggerPayload("After predicate filtration", result));

		return result;
	}

}

export default PredicatePhaseImpl;
