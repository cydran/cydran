import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";
import Watchable from "@/model/Watchable";
import Watcher from "@/filter/Watcher";
import WatcherImpl from "@/filter/WatcherImpl";
import ComparisonEvaluator from "@/model/ComparisonEvaluator";
import ScopeImpl from "@/model/ScopeImpl";

class SortPhaseImpl extends AbstractPhaseImpl {

	private evaluator: ComparisonEvaluator;

	private valueFunctions: (() => any)[];

	private watchers: Watcher<any>[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(previous);
		requireNotNull(expression, "expression");
		this.evaluator = new ComparisonEvaluator(expression, watchable.getWatchContext() as ScopeImpl);
		this.watchers = [];
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Watcher<any> = new WatcherImpl<any>(watchable, parameterExpression, this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		items.sort((first: any, second: any) => this.evaluator.compare(first, second, this.valueFunctions));

		return items;
	}

}

export default SortPhaseImpl;
