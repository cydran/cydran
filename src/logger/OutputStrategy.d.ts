import Logger from './Logger';
interface OutputStrategy {
    log(logger: Logger, level: string, payload: any, error?: Error): void;
}
export default OutputStrategy;
