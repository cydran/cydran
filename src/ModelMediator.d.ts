import Disposable from "./Disposable";
interface ModelMediator extends Disposable {
    invoke(...args: any[]): void;
    get<T>(): T;
    set(value: any): void;
    digest(): boolean;
    watch(context: any, target: (previous: any, current: any) => void): void;
}
export default ModelMediator;
