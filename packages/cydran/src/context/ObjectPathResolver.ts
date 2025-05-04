import { Context } from 'context/Context';

interface ObjectPathResolver {

	resolve<T>(context: Context, path: string, instanceArguments?: unknown[]): T;

}

export default ObjectPathResolver;
