import { Context } from "context/Context";

interface PostProcessor<T> {

	postProcess(context:Context, instance: T): T;

}

export default PostProcessor;