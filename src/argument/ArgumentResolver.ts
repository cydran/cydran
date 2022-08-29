import Context from 'context/Context';

interface ArgumentResolver {

	resolve(context: Context): any;

	postProcess(context: Context, targetObject: any, param: any): void;

}

export default ArgumentResolver;
