import Logger from './Logger';
import LoggerService from './LoggerService';
declare class LoggerImpl implements Logger {
    private name;
    private loggerService;
    constructor(name: string, loggerService: LoggerService);
    trace(payload: any, error?: Error): void;
    debug(payload: any, error?: Error): void;
    info(payload: any, error?: Error): void;
    error(payload: any, error?: Error): void;
    fatal(payload: any, error?: Error): void;
    isTrace(): boolean;
    isDebug(): boolean;
    isInfo(): boolean;
    isError(): boolean;
    isFatal(): boolean;
    getName(): string;
}
export default LoggerImpl;
