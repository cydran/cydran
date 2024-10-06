import Level from "log/Level";
import LoggerStrategy from "log/strategy/LoggerStrategy";
import { Appender } from "log/appender/Appender";

abstract class AbstractLogStrategy implements LoggerStrategy {
	
	abstract getLevel(): Level;

	public ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.trace(logName, payloadFn(), params);
	}

	public ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.debug(logName, payloadFn(), params);
	}

	public ifInfo(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.info(logName, payloadFn(), params);
	}

	public ifWarn(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.warn(logName, payloadFn(), params);
	}

	public ifError(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.error(logName, payloadFn(), params);
	}

	public ifFatal(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.fatal(logName, payloadFn(), params);
	}

	public trace(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.trace(logName, payload, params);
	}

	public debug(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.debug(logName, payload, params);
	}

	public info(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.info(logName, payload, params);
	}

	public warn(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.warn(logName, payload, params);
	}

	public error(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.error(logName, payload, params);
	}

	public fatal(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.fatal(logName, payload, params);
	}
}

export { AbstractLogStrategy };