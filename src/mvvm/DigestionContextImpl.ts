import DigestionCandidate from "@/mvvm/DigestionCandidate";
import DigestLoopError from "@/error/DigestLoopError";
import SimpleMap from "@/pattern/SimpleMap";
import DigestionContext from "@/mvvm/DigestionContext";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";

const MAX_EVALUATIONS: number = 10000;

interface Tracker {
	executions: number;
	notifications: number;
}

class DigestionContextImpl implements DigestionContext {

	private readonly logger: Logger = LoggerFactory.getLogger("DigestionContextImpl");

	private mediators: SimpleMap<DigestionCandidate[]>;

	constructor() {
		this.mediators = {};
	}

	public add(key: string, mediators: DigestionCandidate[]): void {
		if (!this.mediators[key]) {
			this.mediators[key] = [];

			for (const mediator of mediators) {
				this.mediators[key].push(mediator);
			}
		}
	}

	public digest(): void {
		let remainingEvaluations: number = MAX_EVALUATIONS;
		let pending: boolean = true;

		const tracker: Tracker = {
			executions: 0,
			notifications: 0
		};

		while (pending && remainingEvaluations > 0) {
			remainingEvaluations--;

			const changedMediators: DigestionCandidate[] = [];

			for (const key in this.mediators) {
				if (!this.mediators.hasOwnProperty(key)) {
					continue;
				}

				const current: DigestionCandidate[] = this.mediators[key];
				this.digestSegment(changedMediators, current, tracker);
			}

			if (changedMediators.length === 0) {
				pending = false;
				break;
			}

			for (const changedMediator of changedMediators) {
				tracker.notifications++;
				changedMediator.notify();
			}
		}

		if (remainingEvaluations === 0) {
			// TODO - Make this error handling better
			throw new DigestLoopError("Loop detected in digest cycle.");
		}

		this.logger.ifTrace(() => ({
			digestion: tracker
		}));
	}

	private digestSegment(changedMediators: DigestionCandidate[], mediators: DigestionCandidate[], tracker: Tracker): void {
		for (const mediator of mediators) {
			let changed: boolean = false;

			try {
				tracker.executions++;
				changed = mediator.evaluate();
			} catch (e) {
				this.logger.error("Error evaluating mediator: " + mediator.constructor.name);
			}

			if (changed) {
				changedMediators.push(mediator);
			}
		}
	}

}

export default DigestionContextImpl;
