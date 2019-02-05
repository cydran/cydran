import RegistryStrategy from "./RegistryStrategy";
export interface Registry {
    get<T>(id: string): T;
    registerConstant(id: string, instance: any): Registry;
    registerPrototype(id: string, classInstance: any): Registry;
    registerSingleton(id: string, classInstance: any): Registry;
    addStrategy(strategy: RegistryStrategy): void;
}
export declare class RegistryImpl implements Registry {
    static INSTANCE: RegistryImpl;
    private strategies;
    private defaultStrategy;
    constructor();
    get<T>(id: string): T;
    registerConstant(id: string, instance: any): Registry;
    registerPrototype(id: string, classInstance: any): Registry;
    registerSingleton(id: string, classInstance: any): Registry;
    addStrategy(strategy: RegistryStrategy): void;
}
