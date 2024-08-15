import PrototypeFactory from 'registry/PrototypeFactory';
import Context from 'context/Context';
import ArgumentResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import GlobalContextImpl from 'context/GlobalContextImpl';

test("PrototypeFactory Instance", () => {
	const context: Context = new GlobalContextImpl().createChild();
	const fn: (args: any[]) => any = () => {};
	const argumentResolvers: ArgumentsResolvers = new ArgumentResolversBuilderImpl().build();

	expect(new PrototypeFactory(context, fn, argumentResolvers)).not.toBeNull();
});
