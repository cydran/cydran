import { Context } from "cydran";
import MarkdownBehavior from './MarkdownBehavior';

function behaviorCapability(context: Context) {
	context.getRegistry().registerPrototype("cydran:behavior:markdown:*", MarkdownBehavior);
}

export default behaviorCapability;
