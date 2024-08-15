import PathResolver from "context/PathResolver";
import { Context } from "./Context";
import { requireNotNull } from 'util/Utils';
import { PathError } from "error/Errors";
import { LITERAL_PATH_REGEX, LOCAL_ID_REGEX, RELATIVE_PATH_REGEX } from "Constants";

// TODO - Support ./ prefix for relative paths

class PathResolverImpl implements PathResolver {

	resolve<T>(context: Context, path: string, instanceArguments?: any[]): T {
		requireNotNull(context, "context");
		requireNotNull(path, "path");

		if (LOCAL_ID_REGEX.test(path)) {
			return this.resolveLocal<T>(context, path, instanceArguments);
		} else if (RELATIVE_PATH_REGEX.test(path)) {
			return this.resolveRelativePath<T>(context, path, instanceArguments);
		} else if (LITERAL_PATH_REGEX.test(path)) {
			return this.resolveLiteralPath<T>(context, path, instanceArguments);
		} else {
			throw new PathError("Invalid path: " + path);
		}
	}

	private resolveLocal<T>(context: Context, path: string, instanceArguments?: any[]): T {
		return context.getRegistry().getObject(path, instanceArguments);
	}

	private resolveRelativePath<T>(context: Context, path: string, instanceArguments?: any[]): T {
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

		return this.resolveLocal<T>(current, id, instanceArguments);
	}

	private resolveLiteralPath<T>(context: Context, path: string, instanceArguments?: any[]): T {
		const relativePath: string = path.substring(1);

		return this.resolveRelativePath(context.getRoot(), relativePath, instanceArguments);
	}
	
}

export default PathResolverImpl;