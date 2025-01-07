import Level from "log/Level";
import SimpleMap from "interface/SimpleMap";
import { DEFAULT_LOG_STRATEGY, PropertyKeys } from "CydranConstants";
import { AbstractAppender, getNow } from "log/appender/AbstractAppender";

const doPreamble = (label: string, lvl: Level, pOrder: string[]): string => {
	let result: string = "";
	for(const tok of pOrder) {
		switch(tok.toLowerCase()) {
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

const PREAMBLFMT: string = "%c%s " as const;

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

	public trace(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.TRACE);
		this.console.trace(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public debug(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.DEBUG);
		this.console.debug(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public info(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.INFO);
		this.console.info(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public warn(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.WARN);
		this.console.warn(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public error(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.ERROR);
		this.console.error(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public fatal(label: string, message: string, ...moreArgs: any): void {
		const lp: LogPrep = this.doLogPrep(label, Level.FATAL);
		this.console.error(PREAMBLFMT, lp.color, lp.preamble, message, moreArgs);
	}

	public getAlias(): string {
		return DEFAULT_LOG_STRATEGY;
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
