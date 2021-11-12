import DigestableSource from "behavior/DigestableSource";
import Digester from "digest/Digester";

interface Factories {

	createDigester(rootSource: DigestableSource, id: string, name: string, maxEvaluations: number): Digester;

}

export default Factories;
