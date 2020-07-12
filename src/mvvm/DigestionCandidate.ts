import Notifyable from "@/mvvm/Notifyable";
import Evaluatable from "@/mvvm/Evaluatable";

interface DigestionCandidate extends Evaluatable, Notifyable {

	getExpression(): string;

}

export default DigestionCandidate;
