import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import Watchable from "interface/ables/Watchable";
import Provider from "interface/Provider";
import WatcherImpl from "digest/WatcherImpl";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";
import ComparisonEvaluator from "eval/ComparisonEvaluator";
import getLogger from "log/getLogger";

class SortPhaseImpl extends AbstractPhaseImpl {

	private evaluator: ComparisonEvaluator;

	private valueFunctions: (() => unknown)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(`Sort - ${ expression }`, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new ComparisonEvaluator(expression, watchable.getWatchScope() as ScopeImpl, getLogger('comparisonEvaluator', `ComparisonEvaluator: ${ expression }`));
		this.valueFunctions = [];

		// eslint-disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Provider<unknown> = new WatcherImpl<unknown>(watchable, parameterExpression, getLogger('watcher', `Watcher: ${ parameterExpression }`))
				.addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: unknown[]): unknown[] {
		this.getLogger().ifTrace(() => this.loggerPayload("Before sort", items));

		items.sort((first: unknown, second: unknown) =>
			this.evaluator.compare(first, second, this.valueFunctions)
		);

		this.getLogger().ifTrace(() => this.loggerPayload("After sort", items));

		return items;
	}

}

export default SortPhaseImpl;
