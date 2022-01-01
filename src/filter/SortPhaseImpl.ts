import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import IndexedEvaluator from "eval/IndexedEvaluator";
import Watchable from "interface/ables/Watchable";
import Provider from "interface/Provider";
import WatcherImpl from "digest/WatcherImpl";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";
import ComparisonEvaluator from "eval/ComparisonEvaluator";

class SortPhaseImpl extends AbstractPhaseImpl {
	private evaluator: ComparisonEvaluator;

	private valueFunctions: (() => any)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(`${new.target.name} - ${ expression }`, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new ComparisonEvaluator(expression, watchable.getWatchContext() as ScopeImpl);
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Provider<any> = new WatcherImpl<any>(watchable, parameterExpression)
				.addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		this.getLogger().ifTrace(() => this.loggerPayload("Before sort", items));

		items.sort((first: any, second: any) =>
			this.evaluator.compare(first, second, this.valueFunctions)
		);

		this.getLogger().ifTrace(() => this.loggerPayload("After sort", items));

		return items;
	}

}

export default SortPhaseImpl;
