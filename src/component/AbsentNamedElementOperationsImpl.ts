import NamedElementOperations from "@/component/NamedElementOperations";

class AbsentNamedElementOperationsImpl<E extends HTMLElement> implements NamedElementOperations<E> {

	private static readonly INSTANCE: NamedElementOperations<HTMLElement> = new AbsentNamedElementOperationsImpl<HTMLElement>();

	public static getInstance<T extends HTMLElement>(): NamedElementOperations<T> {
		return AbsentNamedElementOperationsImpl.INSTANCE as NamedElementOperations<T>;
	}

	public get(): E {
		return null;
	}

	public focus(): void {
		// Intentionally do nothing
	}

	public blur(): void {
		// Intentionally do nothing
	}

}

export default AbsentNamedElementOperationsImpl;
