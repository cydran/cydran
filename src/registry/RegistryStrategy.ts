import Gettable from "@/registry/Gettable";

interface RegistryStrategy {

	get<T>(id: string, gettable: Gettable): T;

}

export default RegistryStrategy;
