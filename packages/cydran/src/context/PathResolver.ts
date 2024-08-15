import { Context } from 'context/Context';

interface PathResolver {

	resolve<T>(context: Context, path: string, instanceArguments?: any[]): T;

}

export default PathResolver;
