import { Context } from "context/Context";

interface ContextAware {

	setContext(context: Context): void;

}

export default ContextAware;
