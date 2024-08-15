import Notifyable from "interface/ables/Notifyable";

import Digester from "digest/Digester";
import DigestionState from "digest/DigestionState";

import Logger from "log/Logger";
import DigestableSource from "behavior/DigestableSource";
import SimpleMap from "interface/SimpleMap";

import { isDefined, requireNotNull } from "util/Utils";
import DigestionActions from "const/DigestionActions";
import LoggerFactory from "log/LoggerFactory";
import DigestionStateImpl from "digest/DigestionStateImpl";

const DEFAULT_FACTORY: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => DigesterImpl
	= (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => new DigesterImpl(rootSource, id, name, maxEvaluations);

class DigesterImpl implements Digester {

	private logger: Logger;

	private name: string;

	private rootSource: DigestableSource;

	private maxEvaluations: number;

	// tslint:disable-next-line:max-line-length
	private static factory: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => DigesterImpl = (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => new DigesterImpl(rootSource, id, name, maxEvaluations);

	constructor(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) {
		this.rootSource = requireNotNull(rootSource, "rootSource");
		this.name = requireNotNull(name, "name");
		this.logger = LoggerFactory.getLogger(`Digester: ${ id }`);
		this.maxEvaluations = requireNotNull(maxEvaluations, "maxEvaluations");
	}

	public static create(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): DigesterImpl {
		return DigesterImpl.factory(rootSource, id, name, maxEvaluations);
	}

	public static setFactory(factory: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => DigesterImpl): void {
		DigesterImpl.factory = isDefined(factory) ? factory : DEFAULT_FACTORY;
	}

	public digest(): void {
		this.logger.ifTrace(() => `Started digest on ${this.name}`);
		let remainingEvaluations: number = this.maxEvaluations;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			this.logger.trace("Top digest loop");
			remainingEvaluations--;

			const state: DigestionState = DigestionStateImpl.create();
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
