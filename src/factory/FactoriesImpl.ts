import DigestableSource from "behavior/DigestableSource";
import InternalPropertyKeys from "const/InternalPropertyKeys";
import CydranContext from "context/CydranContext";
import Digester from "digest/Digester";
import DigesterImpl from "digest/DigesterImpl";
import DigestionContext from "digest/DigestionContext";
import DigestionContextImpl from "digest/DigestionContextImpl";
import SegmentDigester from "digest/SegmentDigester";
import SegmentDigesterImpl from "digest/SegmentDigesterImpl";
import Factories from "factory/Factories";
import { Properties } from "properties/Property";
import { requireNotNull } from 'util/Utils';

class FactoriesImpl implements Factories {

	private cydranContext: CydranContext;

	private digestorFactory: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => Digester;

	private digestionContextFactory: () => DigestionContext;

	private segmentDigesterFactory: () => SegmentDigester;

	constructor(cydranContext: CydranContext) {
		this.cydranContext = requireNotNull(cydranContext, "cydranContext");
		this.digestorFactory = (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) =>
			new DigesterImpl(this.cydranContext, rootSource, id, name, maxEvaluations, cydranContext.logFactory().getLogger(`Digester: ${ id }`));
		this.digestionContextFactory = () => new DigestionContextImpl(this.cydranContext);
		this.segmentDigesterFactory = () => new SegmentDigesterImpl(cydranContext.logFactory().getLogger(`SegmentDigester`));
	}

	public createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester {
		return this.digestorFactory(rootSource, id, name, maxEvaluations);
	}

	public createDigestionContext(): DigestionContext {
		return this.digestionContextFactory();
	}

	public importFactories(properties: Properties): void {
		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR)) {
			this.digestorFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR);
		}

		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_CONTEXT)) {
			this.digestionContextFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_CONTEXT);
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
