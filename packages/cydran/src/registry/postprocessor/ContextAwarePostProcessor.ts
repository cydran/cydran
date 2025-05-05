import ContextAware from "awareness/ContextAware";
import { Context } from "context/Context";
import PostProcessor from "registry/postprocessor/PostProcessor";
import { hasMethod, isDefined } from "util/Utils";

class ContextAwarePostProcessor implements PostProcessor<unknown> {

	public postProcess(context: Context, instance: unknown) {

		if (isDefined(instance) && hasMethod(instance, "setContext")) {
			(instance as ContextAware).setContext(context);
		}
	}

}

export default ContextAwarePostProcessor;
