import DigestableSource from "behavior/DigestableSource";
import Digester from "digest/Digester";
import DigestionState from "digest/DigestionState";
import SegmentDigester from "digest/SegmentDigester";

interface Factories {

	createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester;

	createDigestionState(): DigestionState;

	createSegmentDigester(): SegmentDigester;

}

export default Factories;
