import Phase from "phase/Phase";
import AbstractPhaseImpl from "phase/AbstractPhaseImpl";
import IndexedEvaluator from "eval/IndexedEvaluator";
import Watchable from "interface/ables/Watchable";
import Supplier from "interface/Supplier";
import WatcherImpl from "digest/WatcherImpl";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";
import { asBoolean } from "util/AsFunctions";

class PredicatePhaseImpl extends AbstractPhaseImpl {
	private evaluator: IndexedEvaluator<boolean>;

	private valueFunctions: (() => any)[];

	constructor(
		previous: Phase,
		expression: string,
		watchable: Watchable,
		parameterExpressions: string[]
	) {
		super(`PredicatePhaseImpl - ${expression}`, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new IndexedEvaluator(
			expression,
			watchable.getWatchContext() as ScopeImpl,
			asBoolean
		);
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Supplier<any> = new WatcherImpl<any>(
				watchable,
				parameterExpression
			).addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		this.getLogger().ifTrace(() => ({
			message: "Before predicate filtration",
			items: items,
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.evaluator.test(current, i, this.valueFunctions)) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => ({
			message: "After predicate filtration",
			items: result,
		}));

		return result;
	}
}

export default PredicatePhaseImpl;
