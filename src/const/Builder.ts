import StageBuilderImpl from "stage/StageBuilderImpl";
import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import StageBuilder from "stage/StageBuilder";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";

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
