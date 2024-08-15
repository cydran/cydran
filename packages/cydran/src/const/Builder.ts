import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";

const argumentsBuilder = function(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
};

export {
	argumentsBuilder
};
