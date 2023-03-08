import InternalPropertyKeys from "const/InternalPropertyKeys";
import DigesterImpl from "digest/DigesterImpl";
import DigestionStateImpl from "digest/DigestionStateImpl";
import SegmentDigesterImpl from "digest/SegmentDigesterImpl";
import { Properties } from "properties/Property";

class Factories {

	public static importFactories(properties: Properties): void {
		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR)) {
			DigesterImpl.setFactory(properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR));
		}

		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_STATE)) {
			DigestionStateImpl.setFactory(properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_STATE));
		}

		if (properties.isDefined(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_SEGMENT_DIGESTER)) {
			SegmentDigesterImpl.setFactory(properties.get(InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_SEGMENT_DIGESTER));
		}
	}

}

export default Factories;
