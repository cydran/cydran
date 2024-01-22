import ContextAware from "awareness/ContextAware";
import { Context } from "context/Context";
import PostProcessor from "registry/postprocessor/PostProcessor";
import { hasMethod, isDefined } from "util/Utils";

class ContextAwarePostProcessor implements PostProcessor<any> {

	public postProcess(context: Context, instance: any) {

		if (isDefined(instance) && hasMethod(instance, "setContext")) {
			(instance as ContextAware).setContext(context);
		}
	}

}

export default ContextAwarePostProcessor;
