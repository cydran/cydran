import DigestableSource from "behavior/DigestableSource";
import Digester from "digest/Digester";
import DigestionContext from "digest/DigestionContext";
import SegmentDigester from "digest/SegmentDigester";

interface Factories {

	createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester;

	createDigestionContext(): DigestionContext;

	createSegmentDigester(): SegmentDigester;

}

export default Factories;
