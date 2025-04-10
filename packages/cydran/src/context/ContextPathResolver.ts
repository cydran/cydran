import { Context } from 'context/Context';

interface ObjectPathResolver {

	resolve(context: Context, path: string): Context;

}

export default ObjectPathResolver;
