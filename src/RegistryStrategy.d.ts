interface RegistryStrategy {
    get<T>(id: string): T;
}
export default RegistryStrategy;
