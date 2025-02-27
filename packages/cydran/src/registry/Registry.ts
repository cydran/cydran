import Register from "registry/Register";
import Gettable from "interface/ables/Gettable";

interface Registry extends Register<Registry>, Gettable {

	extend(context?: any): Registry;

	getLocalObject<T>(id: string): T;

}

export default Registry;
