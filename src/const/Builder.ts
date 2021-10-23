import { StageBuilder, ArgumentsResolversBuilder } from 'stage/Stage';
import StageBuilderImpl from "stage/StageBulderImpl";
import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';

const builder = function(rootSelector: string, windowInstance?: Window): StageBuilder {
	return new StageBuilderImpl(rootSelector, windowInstance);
};

const argumentsBuilder = function(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
};

export {
	builder,
	argumentsBuilder
};
