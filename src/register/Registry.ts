import Gettable from "interface/ables/Gettable";
import RegistryStrategy from "register/RegistryStrategy";
import Register from "register/Register";

interface Registry extends Register, Gettable {

	addStrategy(strategy: RegistryStrategy): void;

}

export default Registry;
