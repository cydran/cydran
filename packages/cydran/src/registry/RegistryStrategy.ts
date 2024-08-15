import Disposable from "interface/ables/Disposable";
import Gettable from "interface/ables/Gettable";

interface RegistryStrategy extends Disposable {

	get<T>(id: string, gettable: Gettable, instanceArguments: any[]): T;

}

export default RegistryStrategy;
