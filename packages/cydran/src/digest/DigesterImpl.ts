import Notifyable from "interface/ables/Notifyable";
import Digester from "digest/Digester";
import DigestionState from "digest/DigestionState";
import Logger from "log/Logger";
import DigestableSource from "behavior/DigestableSource";
import SimpleMap from "interface/SimpleMap";
import { requireNotNull } from "util/Utils";
import { DigestionActions } from "Constants";

class DigesterImpl implements Digester {

	private logger: Logger;

	private name: string;

	private rootSource: DigestableSource;

	private maxEvaluations: number;

	private stateProvider: () => DigestionState;

	constructor(logger: Logger, stateProvider: () => DigestionState, rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) {
		this.stateProvider = requireNotNull(stateProvider, "stateProvider");
		this.rootSource = requireNotNull(rootSource, "rootSource");
		this.name = requireNotNull(name, "name");
		this.logger = requireNotNull(logger, "logger");
		this.maxEvaluations = requireNotNull(maxEvaluations, "maxEvaluations");
	}

	public digest(): void {
		this.logger.ifTrace(() => `Started digest on ${this.name}`);
		let remainingEvaluations: number = this.maxEvaluations;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			this.logger.trace("Top digest loop");
			remainingEvaluations--;

			const state: DigestionState = this.stateProvider();
			this.populate(state);

			const changedMediators: Notifyable[] = state.digest();

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
	}

	private populate(state: DigestionState): void {
		const seen: SimpleMap<boolean> = {};
		const sources: DigestableSource[] = [];

		sources.push(this.rootSource);

		while (sources.length > 0) {
			const source: DigestableSource = sources.pop();
			const id: string = source.getId();

			if (id !== null && seen[id]) {
				continue;
			}

			seen[id] = true;
			source.tell(DigestionActions.REQUEST_DIGESTION_SOURCES, sources);
			source.tell(DigestionActions.REQUEST_DIGESTION_CANDIDATES, state);
		}
	}

}

export default DigesterImpl;
