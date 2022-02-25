import { Consumer } from 'interface/Predicate';

interface Queue<T> {

	add(item: T): void;

	pop(): T;

	isEmpty(): boolean;

	isPopulated(): boolean;

	transform(tranformFunction: (item: T, consumer: Consumer<T>) => void): void;

}

export default Queue;