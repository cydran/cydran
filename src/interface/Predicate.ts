type Predicate<T> = (value: T) => boolean;
type BiPredicate<T, U> = (value0: T, value1: U) => boolean;
type Consumer<T> = (value: T) => void;
type BiConsumer<T, U> = (value0: T, value1?: U) => void;
type VarPredicate<T, U> = Predicate<T> | BiPredicate<T, U>;
type VarConsumer<T, U> = (Consumer<T> | BiConsumer<T, U>);
type Supplier<T> = () => T;

export { Predicate, BiPredicate, Consumer, BiConsumer, VarPredicate, VarConsumer, Supplier };
