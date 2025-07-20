import { CallBackThisObject } from "CydranTypes";

interface Callback {

	thisObject: CallBackThisObject;

	fn: () => void;

}

export default Callback;
