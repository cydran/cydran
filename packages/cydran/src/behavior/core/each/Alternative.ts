import ComponentFactory from "component/ComponentFactory";
import Evaluator from "eval/Evaluator";

interface Alternative {

	test: Evaluator;

	factory: ComponentFactory;

}

export default Alternative;
