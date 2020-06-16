import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import { requireNotNull } from "@/util/ObjectUtils";
import Watchable from "@/model/Watchable";
import WatcherImpl from "@/filter/WatcherImpl";
import ComparisonEvaluator from "@/model/ComparisonEvaluator";
import ScopeImpl from "@/model/ScopeImpl";
import Supplier from "@/pattern/Supplier";
import { Phase } from "@/filter/Interfaces";

class SortPhaseImpl extends AbstractPhaseImpl {

	private evaluator: ComparisonEvaluator;

	private valueFunctions: (() => any)[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super("SortPhaseImpl - " + expression, previous);
		requireNotNull(expression, "expression");
		this.evaluator = new ComparisonEvaluator(expression, watchable.getWatchContext() as ScopeImpl);
		this.valueFunctions = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < parameterExpressions.length; i++) {
			const parameterExpression: string = parameterExpressions[i];
			const watcher: Supplier<any> = new WatcherImpl<any>(watchable, parameterExpression).addCallback(this, this.onChange);
			this.valueFunctions.push(() => watcher.get());
		}
	}

	protected execute(items: any[]): any[] {
		this.getLogger().ifTrace(() => ({
			message: "Before sort",
			items: items
		}));

		items.sort((first: any, second: any) => this.evaluator.compare(first, second, this.valueFunctions));

		this.getLogger().ifTrace(() => ({
			message: "After sort",
			items: items
		}));

		return items;
	}

}

export default SortPhaseImpl;
