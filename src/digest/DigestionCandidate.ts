import Evaluatable from "interface/ables/Evaluatable";
import Notifyable from "interface/ables/Notifyable";

interface DigestionCandidate extends Evaluatable, Notifyable {
	getExpression(): string;
}

export default DigestionCandidate;