import Module from 'module/Module';

interface ArgumentResolver {

	resolve(module: Module): any;

	postProcess(module: Module, target: any, param: any): void;

}

export default ArgumentResolver;
