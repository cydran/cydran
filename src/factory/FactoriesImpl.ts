import DigestableSource from "behavior/DigestableSource";
import InternalPropertyKeys from "const/InternalPropertyKeys";
import Services from "service/Services";
import Digester from "digest/Digester";
import DigesterImpl from "digest/DigesterImpl";
import DigestionState from "digest/DigestionState";
import DigestionStateImpl from "digest/DigestionStateImpl";
import SegmentDigester from "digest/SegmentDigester";
import SegmentDigesterImpl from "digest/SegmentDigesterImpl";
import Factories from "factory/Factories";
import { Properties } from "properties/Property";
import { requireNotNull } from 'util/Utils';

class FactoriesImpl implements Factories {

	private services: Services;

	private digestorFactory: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => Digester;

	private digestionStateFactory: () => DigestionState;

	private segmentDigesterFactory: () => SegmentDigester;

	constructor(services: Services) {
		this.services = requireNotNull(services, "services");
		this.digestorFactory = (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) =>
			new DigesterImpl(this.services, rootSource, id, name, maxEvaluations, services.logFactory().getLogger(`Digester: ${ id }`));
		this.digestionStateFactory = () => new DigestionStateImpl(this.services);
		this.segmentDigesterFactory = () => new SegmentDigesterImpl(services.logFactory().getLogger(`SegmentDigester`));
	}

	public createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester {
		return this.digestorFactory(rootSource, id, name, maxEvaluations);
	}

	public createDigestionState(): DigestionState {
		return this.digestionStateFactory();
	}

	public importFactories(properties: Properties): void {
		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR)) {
			this.digestorFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR);
		}

		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_STATE)) {
			this.digestionStateFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_STATE);
		}

		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_SEGMENT_DIGESTER)) {
			this.segmentDigesterFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_SEGMENT_DIGESTER);
		}
	}

	public createSegmentDigester(): SegmentDigester {
		return this.segmentDigesterFactory();
	}

}

export default FactoriesImpl;
