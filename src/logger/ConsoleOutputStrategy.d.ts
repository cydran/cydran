import OutputStrategy from './OutputStrategy';
import Logger from './Logger';
declare class ConsoleOutputStrategy implements OutputStrategy {
    log(logger: Logger, level: string, payload: any, error?: Error): void;
    private getNow;
}
export default ConsoleOutputStrategy;
