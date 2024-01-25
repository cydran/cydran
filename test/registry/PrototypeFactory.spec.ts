import PrototypeFactory from 'registry/PrototypeFactory';
import { StageImpl } from 'context/RootContextImpl';
import Context from 'context/Context';
import ArgumentResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import ArgumentsResolvers from 'argument/ArgumentsResolvers';

test("PrototypeFactory Instance", () => {
	const context: Context = new StageImpl("body");
	const fn: (args: any[]) => any = () => {};
	const argumentResolvers: ArgumentsResolvers = new ArgumentResolversBuilderImpl().build();

	expect(new PrototypeFactory(context, fn, argumentResolvers)).not.toBeNull();
});
