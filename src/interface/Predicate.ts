type Predicate<T> = (value: T) => boolean;
type BiPredicate<T, U> = (value0: T, value1: U) => boolean;
type Consumer<T> = (value: T) => void;
type BiConsumer<T, U> = (value0: T, value1?: U) => void;
type VarPredicate<T, U> = Predicate<T> | BiPredicate<T, U>;
type VarConsumer<T, U> = (Consumer<T> | BiConsumer<T, U>);
type Supplier<T> = () => T;

type F1<A,R> = (a: A) => R;
type F2<A0,A1,R> = (a0: A0, a1: A1) => R;
type F3<A0,A1,A2,R> = (a0: A0, a1: A1, a2: A2) => R;
type F4<A0,A1,A2,A3,R> = (a0: A0, a1: A1, a2: A2, a3: A3) => R;
type F5<A0,A1,A2,A3,A4,R> = (a0: A0, a1: A1, a2: A2, a3: A3, a4: A4) => R;

// TODO - Rename this file to better reflect that it contains all sorts of functional constructs

export {
	Predicate,
	BiPredicate,
	Consumer,
	BiConsumer,
	VarPredicate,
	VarConsumer,
	Supplier,
	F1,
	F2,
	F3,
	F4,
	F5
};
