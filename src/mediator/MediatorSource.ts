import Tellable from "interface/ables/Tellable";

interface MediatorSource extends Tellable {

	/**
	 * Get the mediator id value
	 * @returns string id representation
	 */
	getId(): string;

}

export default MediatorSource;
