import ContextPathResolver from "context/ContextPathResolver";
import { Context } from "./Context";
import { isDefined, requireNotNull } from 'util/Utils';
import { PathError } from "error/Errors";
import { LITERAL_CONTEXT_PATH, CONTEXT_NAME, RELATIVE_CONTEXT_PATH, LOCAL_CONTEXT_PATH, PARENT_CONTEXT_PATH } from "CydranConstants";

// TODO - Support ./ prefix for relative paths

class ContextPathResolverImpl implements ContextPathResolver {

	resolve(context: Context, path: string): Context {
		requireNotNull(context, "context");
		requireNotNull(path, "path");

		let result: Context = null;

		if (LOCAL_CONTEXT_PATH.test(path)) {
			result = context;
		} else if (PARENT_CONTEXT_PATH.test(path)) {
			result = context.getParent();
		} else if (CONTEXT_NAME.test(path)) {
			result = this.resolveLocal(context, path);
		} else if (RELATIVE_CONTEXT_PATH.test(path)) {
			result = this.resolveRelativePath(context, path);
		} else if (LITERAL_CONTEXT_PATH.test(path)) {
			result = this.resolveLiteralPath(context, path);
		} else {
			throw new PathError("Invalid path: " + path);
		}

		if (!isDefined(result) ) {
			throw new PathError("Unknown path: " + path);
		}

		return result;
	}

	private resolveLocal(context: Context, path: string): Context {
		const wasParent: boolean = PARENT_CONTEXT_PATH.test(path);

		if (wasParent) {
			return context.getParent();
		} else {
			return context.getChild(path);
		}
	}

	private resolveRelativePath(context: Context, path: string): Context {
		const segments: string[] = path.split("/");

		let current: Context = context;

		while (segments.length > 1) {
			const segment: string = segments.shift();

			if (!isDefined(current) ) {
				break;
			}

			if (segment === ".") {
				// Intentionally do nothing
			} else if (segment === "..") {
				current = current.getParent();
			} else {
				current = current.getChild(segment);
			}
		}

		const id: string = segments[0];

		return isDefined(current) ? this.resolveLocal(current, id) : null;
	}

	private resolveLiteralPath(context: Context, path: string): Context {
		const relativePath: string = path.substring(1);

		return this.resolveRelativePath(context.getRoot(), relativePath);
	}
	
}

export default ContextPathResolverImpl;