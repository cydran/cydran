import Notifyable from "interface/ables/Notifyable";

import Digester from "digest/Digester";
import DigestionContext from "digest/DigestionContext";
import DigestionContextImpl from "digest/DigestionContextImpl";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import DigestableSource from "behavior/DigestableSource";
import SimpleMap from "interface/SimpleMap";

import { requireNotNull } from "util/Utils";
import DigestionActions from "const/DigestionActions";
import CydranContext from "context/CydranContext";

class DigesterImpl implements Digester {

	private logger: Logger;

	private name: string;

	private cydranContext: CydranContext;

	private rootSource: DigestableSource;

	private maxEvaluations: number;

	constructor(cydranContext: CydranContext, rootSource: DigestableSource, id: string, name: string, maxEvaluations: number, logger: Logger) {
		this.cydranContext = requireNotNull(cydranContext, "cydranContext");
		this.rootSource = requireNotNull(rootSource, "rootSource");
		this.name = requireNotNull(name, "name");
		this.logger = logger;
		this.maxEvaluations = requireNotNull(maxEvaluations, "maxEvaluations");
	}

	public digest(): void {
		this.logger.ifTrace(() => `Started digest on ${this.name}`);
		let remainingEvaluations: number = this.maxEvaluations;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			this.logger.trace("Top digest loop");
			remainingEvaluations--;

			const context: DigestionContext = this.cydranContext.getFactories().createDigestionContext();
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
	}

	private populate(context: DigestionContext): void {
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
			source.tell(DigestionActions.REQUEST_DIGESTION_CANDIDATES, context);
		}
	}
}

export default DigesterImpl;
