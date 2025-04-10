import ObjectPathResolver from "context/ObjectPathResolver";
import { Context } from "./Context";
import { requireNotNull } from 'util/Utils';
import { PathError } from "error/Errors";
import { LITERAL_OBJECT_PATH, OBJECT_ID, RELATIVE_OBJECT_PATH } from "CydranConstants";
import { InternalContext } from 'context/Context';

// TODO - Support ./ prefix for relative paths

class ObjectPathResolverImpl implements ObjectPathResolver {

	resolve<T>(context: Context, path: string, instanceArguments?: any[]): T {
		requireNotNull(context, "context");
		requireNotNull(path, "path");

		if (OBJECT_ID.test(path)) {
			return this.resolveLocal<T>(context, path, instanceArguments);
		} else if (RELATIVE_OBJECT_PATH.test(path)) {
			return this.resolveRelativePath<T>(context, path, instanceArguments);
		} else if (LITERAL_OBJECT_PATH.test(path)) {
			return this.resolveLiteralPath<T>(context, path, instanceArguments);
		} else {
			throw new PathError("Invalid path: " + path);
		}
	}

	private resolveLocal<T>(context: Context, path: string, instanceArguments?: any[]): T {
		return (context as unknown as InternalContext).getRegistry().getObject(path, instanceArguments, context);
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

export default ObjectPathResolverImpl;