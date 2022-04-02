import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import { requireNotNull, isDefined, padRight } from "util/Utils";

const LOGGER_NAME_LENGTH = 20;

class LoggerImpl implements Logger {
	private name: string;

	private loggerService: LoggerService;

	private level: Level;

	private outStrat: string;

	constructor(name: string, loggerService: LoggerService, strategy: string = null) {
		const wkName: string = requireNotNull(name, "name");
		this.name = (name.length < LOGGER_NAME_LENGTH) ? padRight(wkName, LOGGER_NAME_LENGTH): wkName;
		this.loggerService = loggerService;
		this.outStrat = strategy;
	}

	public setLevel(level: Level) {
		this.level = level;
		this.ifDebug(() => `Log level set @ "${ Level[this.level] }" for "${ this.name.trim() }" logger`);
	}

	public getLevel(): Level {
		return isDefined(this.level) ? this.level : this.loggerService.getLevel();
	}

	public getStrategyId(): string {
		return this.outStrat;
	}

	public trace(payload: any, error?: Error): void {
		this.rootLog(Level.TRACE, payload, error);
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.TRACE, payloadFn(), error, this.isTrace());
	}

	public debug(payload: any, error?: Error): void {
		this.rootLog(Level.DEBUG, payload, error);
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.DEBUG, payloadFn(), error, this.isDebug());
	}

	public info(payload: any, error?: Error): void {
		this.rootLog(Level.INFO, payload, error);
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.INFO, payloadFn(), error, this.isInfo());
	}

	public warn(payload: any, error?: Error): void {
		this.rootLog(Level.WARN, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.WARN, payloadFn(), error, this.isWarn());
	}

	public error(payload: any, error?: Error): void {
		this.rootLog(Level.ERROR, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.ERROR, payloadFn(), error, this.isError());
	}

	public fatal(payload: any, error?: Error): void {
		this.rootLog(Level.FATAL, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		this.rootIfLog(Level.FATAL, payloadFn(), error, this.isFatal());
	}

	public ifLog(payloadFn: () => any, lvl: Level, error?: Error): void {
		let lvlTst: string = Level[lvl].toLowerCase();
		lvlTst = `is${ lvlTst.charAt(0).toUpperCase() }${ lvlTst.substring(1) }`;
		this.rootIfLog(lvl, payloadFn(), error, this[lvlTst]());
	}

	public isTrace(): boolean {
		return this.willMeet(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.willMeet(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.willMeet(Level.INFO);
	}

	public isWarn(): boolean {
		return this.willMeet(Level.WARN);
	}

	public isError(): boolean {
		return this.willMeet(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.willMeet(Level.FATAL);
	}

	public isDisabled(): boolean {
		return this.willMeet(Level.DISABLED);
	}

	public getName(): string {
		return this.name;
	}

	protected willMeet(chkdLvl: Level): boolean  {
		return isDefined(this.level) ? (chkdLvl >= this.level) : this.loggerService.willMeet(chkdLvl);
	}

	private rootLog(level: Level, payload: any, error: Error) {
		this.loggerService.log(this, level, payload, error, this.outStrat);
	}

	private rootIfLog(level: Level, payload: any, error: Error, okPass: boolean) {
		if(okPass && isDefined(payload)) {
			this.loggerService.log(this, level, payload, error, this.outStrat);
		}
	}

}

export default LoggerImpl;
