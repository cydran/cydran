import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import Notifyable from "interface/ables/Notifyable";

import Digester from "digest/Digester";
import DigestionContext from "digest/DigestionContext";
import DigestionContextImpl from "digest/DigestionContextImpl";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import BehaviorSource from "behavior/BehaviorSource";
import SimpleMap from "interface/SimpleMap";
import EventHooks from "event/EventHooks";
import EventHooksImpl from "event/EventHooksImpl";

import { requireNotNull } from "util/Utils";

class DigesterImpl implements Digester {
	public static readonly DIGESTION_START_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	public static readonly DIGESTION_END_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	public static readonly DIGESTION_CYCLE_START_HOOKS: EventHooks<Nestable> = new EventHooksImpl();

	private logger: Logger;

	private nameFn: () => string;

	private messagableSourceFn: () => Tellable[];

	private rootBehaviorSource: BehaviorSource;

	private skipableIds: string[];

	private maxEvaluations: number;

	constructor(rootBehaviorSource: BehaviorSource, id: string, nameFn: () => string, messagableSourceFn: () => Tellable[], maxEvaluations: number) {
		this.skipableIds = [];
		this.rootBehaviorSource = requireNotNull(rootBehaviorSource, "rootBehaviorSource");
		this.nameFn = requireNotNull(nameFn, "nameFn");
		this.messagableSourceFn = requireNotNull(messagableSourceFn, "messagableSourceFn");
		this.logger = LoggerFactory.getLogger(`Digester: ${ id }`);
		this.maxEvaluations = requireNotNull(maxEvaluations, "maxEvaluations");
	}

	public skipId(id: string): void {
		if (id !== null && id !== undefined) {
			this.skipableIds.push(id);
		}
	}

	public digest(): void {
		DigesterImpl.DIGESTION_START_HOOKS.notify(
			(this.rootBehaviorSource as unknown) as Nestable
		);
		this.logger.ifTrace(() => `Started digest on ${this.nameFn()}`);
		let remainingEvaluations: number = this.maxEvaluations;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			DigesterImpl.DIGESTION_CYCLE_START_HOOKS.notify(this.rootBehaviorSource as unknown as Nestable);
			this.logger.trace("Top digest loop");
			remainingEvaluations--;

			const context: DigestionContext = new DigestionContextImpl();
			this.populate(context);

			const changedMediators: Notifyable[] = context.digest();

			if (changedMediators.length === 0) {
				pending = false;
				this.logger.trace("Nothing to notify");
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notify();
			}

			this.logger.trace("End digest loop");
		}

		DigesterImpl.DIGESTION_END_HOOKS.notify(
			(this.rootBehaviorSource as unknown) as Nestable
		);
	}

	private populate(context: DigestionContext): void {
		const seen: SimpleMap<boolean> = {};
		const sources: BehaviorSource[] = [];

		while (this.skipableIds.length > 0) {
			const skipableId: string = this.skipableIds.pop();

			if (skipableId !== null) {
				seen[skipableId] = true;
			}
		}

		sources.push(this.rootBehaviorSource);

		const messagables: Tellable[] = this.messagableSourceFn();

		for (const component of messagables) {
			component.tell("consumeDigestionCandidates", sources);
		}

		while (sources.length > 0) {
			const source: BehaviorSource = sources.pop();
			const id: string = source.getId();

			if (id !== null && seen[id]) {
				continue;
			}

			seen[id] = true;
			source.tell("requestBehaviorSources", sources);
			source.tell("requestBehaviors", context);
		}
	}
}

export default DigesterImpl;
