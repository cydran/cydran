import { StageBuilder, ArgumentsResolversBuilder } from 'stage/Stage';
import StageBuilderImpl from "stage/StageBulderImpl";
import ArgumentsResolversBuilderImpl from 'stage/ArgumentResolversBuilderImpl';

const builder = function(rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

const argumentsBuilder = function(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
};

export {
	builder,
	argumentsBuilder
};
