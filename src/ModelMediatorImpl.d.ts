import ModelMediator from "./ModelMediator";
declare class ModelMediatorImpl implements ModelMediator {
    private logger;
    private model;
    private expression;
    private previous;
    private filterCode;
    private filters;
    private context;
    private target;
    constructor(model: any, expression: string, filterCode: string, filters: any);
    invoke(...args: any[]): void;
    get<T>(): T;
    set(value: any): void;
    digest(): boolean;
    watch(context: any, target: (previous: any, current: any) => void): void;
    dispose(): void;
    protected getExpression(): string;
}
export default ModelMediatorImpl;
