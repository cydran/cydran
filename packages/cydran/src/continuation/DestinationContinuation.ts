import { To } from "CydranConstants";

interface DestinationContinuation {

	withPropagation(propagation: To): void;

	toSelf(): void;

}

export default DestinationContinuation;
