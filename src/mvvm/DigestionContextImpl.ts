import DigestionCandidate from "@/mvvm/DigestionCandidate";
import DigestLoopError from "@/error/DigestLoopError";
import SimpleMap from "@/pattern/SimpleMap";
import DigestionContext from "@/mvvm/DigestionContext";

const MAX_EVALUATIONS: number = 10000;

class DigestionContextImpl implements DigestionContext {

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

		while (pending && remainingEvaluations > 0) {
			remainingEvaluations--;

			const changedMediators: DigestionCandidate[] = [];

			for (const key in this.mediators) {
				if (!this.mediators.hasOwnProperty(key)) {
					continue;
				}

				const current: DigestionCandidate[] = this.mediators[key];
				this.digestSegment(changedMediators, current);
			}

			if (changedMediators.length === 0) {
				pending = false;
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notify();
			}
		}

		if (remainingEvaluations === 0) {
			// TODO - Make this error handling better
			throw new DigestLoopError("Loop detected in digest cycle.");
		}

		for (const key in this.mediators) {
			if (!this.mediators.hasOwnProperty(key)) {
				continue;
			}

			const current: DigestionCandidate[] = this.mediators[key];

			for (const mediator of current) {
				mediator.execute();
			}

		}
	}

	private digestSegment(changedMediators: DigestionCandidate[], mediators: DigestionCandidate[]): void {
		for (const mediator of mediators) {
			const changed: boolean = mediator.evaluate();

			if (changed) {
				changedMediators.push(mediator);
			}
		}
	}

}

export default DigestionContextImpl;
