import { StageBuilder, ArgumentsResolversBuilder } from 'stage/Stage';
import StageBuilderImpl from "stage/StageBulderImpl";
import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';

const builder = function(rootSelector: string, properties: any = {}): StageBuilder {
	return new StageBuilderImpl(rootSelector, properties);
};

const argumentsBuilder = function(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
};

export {
	builder,
	argumentsBuilder
};
