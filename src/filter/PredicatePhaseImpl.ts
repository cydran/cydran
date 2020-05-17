import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";
import IndexedEvaluator from "@/model/IndexedEvaluator";
import { asBoolean } from "@/model/Reducers";
import Watchable from "@/model/Watchable";
import Watcher from "@/filter/Watcher";
import WatcherImpl from "@/filter/WatcherImpl";
import ScopeImpl from "@/model/ScopeImpl";

class PredicatePhaseImpl extends AbstractPhaseImpl {

	private evaluator: IndexedEvaluator<boolean>;

	private valueFunctions: (() => any)[];

	private watchers: Watcher<any>[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(previous);
		requireNotNull(expression, "expression");
		this.evaluator = new IndexedEvaluator(expression, watchable.getWatchContext() as ScopeImpl, asBoolean);
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
		const result: any[] = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.evaluator.test(current, i, this.valueFunctions)) {
				result.push(current);
			}
		}

		return result;
	}

}

export default PredicatePhaseImpl;
