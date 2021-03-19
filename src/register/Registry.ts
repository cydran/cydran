import Gettable from "@/interface/ables/Gettable";
import Register from "@/register/Register";
import RegistryStrategy from "@/register/RegistryStrategy";

interface Registry extends Register, Gettable {

	addStrategy(strategy: RegistryStrategy): void;

}

export default Registry;