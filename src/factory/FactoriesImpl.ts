import DigestableSource from "behavior/DigestableSource";
import InternalPropertyKeys from "const/InternalPropertyKeys";
import CydranContext from "context/CydranContext";
import Digester from "digest/Digester";
import DigesterImpl from "digest/DigesterImpl";
import Factories from "factory/Factories";
import { Properties } from "properties/Property";
import { requireNotNull } from 'util/Utils';

class FactoriesImpl implements Factories {

	private cydranContext: CydranContext;

	private digestorFactory: (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) => Digester;

	constructor(cydranContext: CydranContext) {
		this.cydranContext = requireNotNull(cydranContext, "cydranContext");
		this.digestorFactory = (rootSource: DigestableSource, id: string, name: string, maxEvaluations: number) =>
			new DigesterImpl(this.cydranContext, rootSource, id, name, maxEvaluations);
	}

	public createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester {
		return this.digestorFactory(rootSource, id, name, maxEvaluations);
	}

	public importFactories(properties: Properties): void {
		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR)) {
			this.digestorFactory = properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR);
		}
	}

}

export default FactoriesImpl;
