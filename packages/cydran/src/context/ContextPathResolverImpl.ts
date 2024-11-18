import ContextPathResolver from "context/ContextPathResolver";
import { Context } from "./Context";
import { requireNotNull } from 'util/Utils';
import { PathError } from "error/Errors";
import { LITERAL_CONTEXT_PATH, CONTEXT_NAME, RELATIVE_CONTEXT_PATH } from "CydranConstants";

// TODO - Support ./ prefix for relative paths

class ContextPathResolverImpl implements ContextPathResolver {

	resolve(context: Context, path: string): Context {
		requireNotNull(context, "context");
		requireNotNull(path, "path");

		if (CONTEXT_NAME.test(path)) {
			return this.resolveLocal(context, path);
		} else if (RELATIVE_CONTEXT_PATH.test(path)) {
			return this.resolveRelativePath(context, path);
		} else if (LITERAL_CONTEXT_PATH.test(path)) {
			return this.resolveLiteralPath(context, path);
		} else {
			throw new PathError("Invalid path: " + path);
		}
	}

	private resolveLocal(context: Context, path: string): Context {
		return context.getChild(path);
	}

	private resolveRelativePath(context: Context, path: string): Context {
		const segments: string[] = path.split("/");

		let current: Context = context;

		while (segments.length > 1) {
			const segment: string = segments.shift();

			if (segment === ".") {
				// Intentionally do nothing
			} else if (segment === "..") {
				current = current.getParent();
			} else {
				current = current.getChild(segment);
			}
		}

		const id: string = segments[0];

		return this.resolveLocal(current, id);
	}

	private resolveLiteralPath(context: Context, path: string): Context {
		const relativePath: string = path.substring(1);

		return this.resolveRelativePath(context.getRoot(), relativePath);
	}
	
}

export default ContextPathResolverImpl;