import { Context } from "context/Context";

interface ContextAware {

	// TODO - Rename to setCydranContext to avoid naming conflicts with other libraries

	setContext(context: Context): void;

}

export default ContextAware;
