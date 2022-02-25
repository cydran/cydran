import Tellable from "interface/ables/Tellable";

interface DigestableSource extends Tellable {

	/**
	 * Get the digestable source id value
	 * @returns string id representation
	 */
	getId(): string;

}

export default DigestableSource;
