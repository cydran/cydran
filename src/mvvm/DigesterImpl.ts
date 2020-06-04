import Digester from "@/mvvm/Digester";
import Logger from "@/logger/Logger";
import DigestionContext from "@/mvvm/DigestionContext";
import DigestionContextImpl from "@/mvvm/DigestionContextImpl";
import SimpleMap from "@/pattern/SimpleMap";
import MediatorSource from "@/mvvm/MediatorSource";
import { INTERNAL_DIRECT_CHANNEL_NAME } from "@/constant/Constants";
import Notifyable from "@/mvvm/Notifyable";
import { requireNotNull } from "@/util/ObjectUtils";
import LoggerFactory from "@/logger/LoggerFactory";
import Messagable from "@/message/Messagable";

const MAX_EVALUATIONS: number = 10000;

class DigesterImpl implements Digester {

	private logger: Logger;

	private nameFn: () => string;

	private messagableSourceFn: () => Messagable[];

	private rootMediatorSource: MediatorSource;

	private skipableIds: string[];

	constructor(rootMediatorSource: MediatorSource, id: string, nameFn: () => string, messagableSourceFn: () => Messagable[]) {
		this.skipableIds = [];
		this.rootMediatorSource = requireNotNull(rootMediatorSource, "rootMediatorSource");
		this.nameFn = requireNotNull(nameFn, "nameFn");
		this.messagableSourceFn = requireNotNull(messagableSourceFn, "messagableSourceFn");
		this.logger = LoggerFactory.getLogger("Digester " + id);
	}

	public skipId(id: string): void {
		if (id !== null && id !== undefined) {
			this.skipableIds.push(id);
		}
	}

	public digest(): void {
		this.logger.ifTrace(() => "Started digest on " + this.nameFn());
		let remainingEvaluations: number = MAX_EVALUATIONS;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
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
	}

	private populate(context: DigestionContext): void {
		const seen: SimpleMap<boolean> = {};
		const sources: MediatorSource[] = [];

		while (this.skipableIds.length > 0) {
			const skipableId: string = this.skipableIds.pop();

			if (skipableId !== null) {
				seen[skipableId] = true;
			}
		}

		sources.push(this.rootMediatorSource);

		const messagables: Messagable[] = this.messagableSourceFn();

		for (const component of messagables) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "consumeDigestionCandidates", sources);
		}

		while (sources.length > 0) {
			const source: MediatorSource = sources.pop();
			const id: string = source.getId();

			if (id !== null && seen[id]) {
				continue;
			}

			seen[id] = true;
			source.requestMediatorSources(sources);
			source.requestMediators(context);
		}
	}

}

export default DigesterImpl;
