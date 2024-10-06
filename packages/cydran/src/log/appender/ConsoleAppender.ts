import Level from "log/Level";
import SimpleMap from "interface/SimpleMap";
import { DEFAULT_LOG_STRATEGY, PropertyKeys } from "CydranConstants";
import { AbstractAppender } from "log/appender/AbstractAppender";
import { Console } from "console";

const colorPfx: string = PropertyKeys.CYDRAN_LOG_COLOR_PREFIX as const;
const preamOrdrKey: string = PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER as const;

const getNow = (): string => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

type OutColor = {orig: string, alt: string};
type LogPrep = {color: string, preamble: string};

class ConsoleAppender extends AbstractAppender {

	private preambleOrder: string[];

	private wkColors: SimpleMap<OutColor> = {
		WARN: {orig: '#ff9400', alt: null},
		TRACE: {orig: "#ffd478", alt: null},
		FULLSTACK: {orig: "#ff2f92", alt: null},
		DEBUG: {orig: "#008e00", alt: null},
		INFO: {orig: "#0096ff", alt: null}
	};

	private console: Console;

	public constructor(id: string, pOrder: string = "level:time:name", wkConsole: Console = console) {
		super(id);
		this.console = wkConsole;
		this.preambleOrder = pOrder.toLowerCase().split(":");
	}

	public trace(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.TRACE);
		this.console.trace("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public debug(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.DEBUG);
		this.console.debug("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public info(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.INFO);
		this.console.info("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public warn(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.WARN);
		this.console.warn("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public error(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.ERROR);
		this.console.error("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public fatal(name: string, payload: any, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(name, Level.FATAL);
		this.console.error("%c%s%c%s", lp.color, lp.preamble, null, payload, params);
	}

	public getAlias(): string {
		return DEFAULT_LOG_STRATEGY;
	}

	public log(level: Level, name: string, payload: any, ...params: any): void {
		if (level !== Level.DISABLED) {
			switch(level) {
				case Level.TRACE:
					this.trace(name, payload, params);
					break;
				case Level.DEBUG:
					this.debug(name, payload, params);
					break;
				case Level.INFO:
					this.info(name, payload, params);
					break;
				case Level.WARN:
					this.warn(name, payload, params);
					break;
				case Level.ERROR:
					this.error(name, payload, params);
					break;
				case Level.FATAL:
					this.fatal(name, payload, params);
					break;
				default:
					break;
			}	
		}
	}

	private doLogPrep(name: string, lvl: Level): LogPrep {
		return {color: "color:" + this.getColor(lvl), preamble: this.createPreamble(name, lvl, this.preambleOrder)};
	}

	private createPreamble(logName: string, lvl: Level, pOrder: string[]): string {
		let result: string = "";
		for(const tok of pOrder) {
			switch(tok) {
				case "time":
					result += getNow() + " ";
					break;
				case "level":
					result += "[" + lvl.padEnd(5, " ") + "] ";
					break;
				case "name":
					result += "[ " + logName + " ] ";
					break;
				default:
					break;
			}
		};
		return result.trim();
	}

	private getColor(lvl: Level): string | null {
		const wkCol: OutColor = this.wkColors[lvl]; 
		return wkCol?.alt || wkCol?.orig || null;
	}

}

export default ConsoleAppender;
