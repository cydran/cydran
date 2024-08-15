import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";

function argumentsBuilder(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
}

export default argumentsBuilder;
