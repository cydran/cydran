import DigestableSource from "behavior/DigestableSource";
import Digester from "digest/Digester";
import DigestionContext from "digest/DigestionContext";

interface Factories {

	createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester;

	createDigestionContext(): DigestionContext;

}

export default Factories;
