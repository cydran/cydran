import Gettable from "interface/ables/Gettable";
import RegistryStrategy from "registry/RegistryStrategy";
import Register from "registry/Register";

interface Registry extends Register, Gettable {

	addStrategy(strategy: RegistryStrategy): void;

}

export default Registry;
