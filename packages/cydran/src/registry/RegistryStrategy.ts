import Gettable from "interface/ables/Gettable";
import Releasable from "interface/ables/Releasable";

interface RegistryStrategy extends Releasable {

	get<T>(id: string, gettable: Gettable, instanceArguments: any[]): T;

}

export default RegistryStrategy;
