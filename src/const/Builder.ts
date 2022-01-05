import { StageBuilder, ArgumentsResolversBuilder } from 'stage/Stage';
import StageBuilderImpl from "stage/StageBulderImpl";
import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';

const builder = function(rootSelector: string, properties: any = {}, windowInstance?: Window): StageBuilder {
	return new StageBuilderImpl(rootSelector, properties, windowInstance);
};

const argumentsBuilder = function(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
};

export {
	builder,
	argumentsBuilder
};
