import { Context } from 'context/Context';

interface ObjectPathResolver {

	resolve<T>(context: Context, path: string, instanceArguments?: any[]): T;

}

export default ObjectPathResolver;
