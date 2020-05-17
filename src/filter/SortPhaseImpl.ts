import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";
import IndexedEvaluator from "@/model/IndexedEvaluator";
import { asNumber } from "@/model/Reducers";
import Watchable from "@/model/Watchable";
import Watcher from "@/filter/Watcher";
import WatcherImpl from "@/filter/WatcherImpl";

class SortPhaseImpl extends AbstractPhaseImpl {

	private evaluator: IndexedEvaluator<number>;

	private valueFunctions: (() => any)[];

	private watchers: Watcher<any>[];

	constructor(previous: Phase, expression: string, watchable: Watchable, parameterExpressions: string[]) {
		super(previous);
		requireNotNull(expression, "expression");
		this.evaluator = new IndexedEvaluator(expression, asNumber);
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
		// const result: any[] = [];

		items.sort((first: any, second: any) => {
			const nameA = first["title"];
			const nameB = second["title"];

			if (nameA < nameB) {
				return -1;
			}

			if (nameA > nameB) {
				return 1;
			}

			return 0;
		});

		// tslint:disable-next-line:prefer-for-of
		// for (let i = 0; i < items.length; i++) {
		// 	const current: any = items[i];

		// 	if (this.evaluator.test(current, this.valueFunctions)) {
		// 		result.push(current);
		// 	}
		// }

		return items;
	}

}

export default SortPhaseImpl;
