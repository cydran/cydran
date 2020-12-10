import Tellable from "interface/ables/Tellable";

interface BehaviorSource extends Tellable {

	/**
	 * Get the behavior id value
	 * @returns string id representation
	 */
	getId(): string;

}

export default BehaviorSource;
