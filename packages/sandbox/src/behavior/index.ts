import { Context } from "@cydran/cydran";
import MarkdownBehavior from './MarkdownBehavior';

function behaviorCapability(context: Context) {
	context.registerPrototype("cydran:behavior:markdown:*", MarkdownBehavior);
}

export default behaviorCapability;
