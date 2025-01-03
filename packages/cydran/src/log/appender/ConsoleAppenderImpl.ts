import Level from "log/Level";
import SimpleMap from "interface/SimpleMap";
import { DEFAULT_LOG_STRATEGY, PropertyKeys } from "CydranConstants";
import { AbstractAppender, getNow } from "log/appender/AbstractAppender";

const doPreamble = (label: string, lvl: Level, pOrder: string[]): string => {
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
				result += "[ " + label + " ] ";
				break;
			default:
				break;
		}
	};
	return result.trim();
}

const colorPfx: string = PropertyKeys.CYDRAN_LOG_COLOR_PREFIX as const;
const preamOrdrKey: string = PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER as const;

const PREAMBLFMT: string = "%c%s%c " as const;

type OutColor = {orig: string, alt: string};
type LogPrep = {color: string, preamble: string};

class ConsoleAppender extends AbstractAppender {

	private preambleOrder: string[];

	private wkColors: SimpleMap<OutColor> = {
		FATAL: {orig: "#ff2f92", alt: null},
		ERROR: {orig: "#ff2f92", alt: null},
		WARN: {orig: '#ff9400', alt: null},
		INFO: {orig: "#0096ff", alt: null},
		DEBUG: {orig: "#008e00", alt: null},
		TRACE: {orig: "#ffd478", alt: null}
	};

	private console: Console;

	public constructor(id: string, pOrder: string = "level:time:name", wkConsole: Console = console) {
		super(id);
		this.console = wkConsole;
		this.preambleOrder = pOrder.toLowerCase().split(":");
	}

	public trace(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.TRACE);
		this.console.trace(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public debug(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.DEBUG);
		this.console.debug(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public info(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.INFO);
		this.console.info(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public warn(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.WARN);
		this.console.warn(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public error(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.ERROR);
		this.console.error(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public fatal(label: string, msgBase: string, ...params: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.FATAL);
		this.console.error(this.doMsgFormat(msgBase), lp.color, lp.preamble, params);
	}

	public log(level: Level, label: string, msgBase: string, ...params: any): void {
		if (level !== Level.DISABLED) {
			switch(level) {
				case Level.TRACE:
					this.trace(label, msgBase, params);
					break;
				case Level.DEBUG:
					this.debug(label, msgBase, params);
					break;
				case Level.INFO:
					this.info(label, msgBase, params);
					break;
				case Level.WARN:
					this.warn(label, msgBase, params);
					break;
				case Level.ERROR:
					this.error(label, msgBase, params);
					break;
				case Level.FATAL:
					this.fatal(label, msgBase, params);
					break;
				default:
					break;
			}	
		}
	}

	public getAlias(): string {
		return DEFAULT_LOG_STRATEGY;
	}

	private doMsgFormat(msgBase: string) {
		return PREAMBLFMT + (msgBase ?? "") + " ";
	}

	private doLogPrep(label: string, lvl: Level): LogPrep {
		return {color: `color: ${ this.getColor(lvl) }`, preamble: doPreamble(label, lvl, this.preambleOrder)};
	}

	private getColor(lvl: Level): string | null {
		const wkCol: OutColor = this.wkColors[lvl]; 
		return wkCol?.alt || wkCol?.orig || null;
	}

}

export default ConsoleAppender;
