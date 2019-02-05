import Logger from './Logger';
import Level from './Level';
declare class LoggerService {
    static INSTANCE: LoggerService;
    private level;
    private outputStrategy;
    private levelNames;
    constructor();
    log(logger: Logger, level: Level, payload: any, error?: Error): void;
    setLevel(level: Level): void;
    isTrace(): boolean;
    isDebug(): boolean;
    isInfo(): boolean;
    isError(): boolean;
    isFatal(): boolean;
}
export default LoggerService;
