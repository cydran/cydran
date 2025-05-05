import Level from "log/Level";
import SimpleMap from "interface/SimpleMap";
import { DEFAULT_LOG_STRATEGY, PropertyKeys } from "CydranConstants";
import { AbstractAppender, getNow } from "log/appender/AbstractAppender";
import { isDefined } from "util/Utils";

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

	public log(lvl: Level, label: string, msg: string, wkArgs?: unknown[], error?: Error) {
		const lp: LogPrep = this.doLogPrep(label, lvl);
		if (wkArgs && wkArgs.length > 0) {
			if (isDefined(error)) {
				this.console.log(PREAMBLFMT, lp.color, lp.preamble, msg, wkArgs, error);
			} else {
				this.console.log(PREAMBLFMT, lp.color, lp.preamble, msg, wkArgs);
			}
		} else {
			if (isDefined(error)) {
				this.console.log(PREAMBLFMT, lp.color, lp.preamble, msg, error);
			} else {
				this.console.log(PREAMBLFMT, lp.color, lp.preamble, msg);
			}
		}
	}

	public trace(label: string, message: string, error: Error = null, moreArgs: unknown[] = []): void {
		this.log(Level.TRACE, label, message, moreArgs, error);
	}

	public debug(label: string, message: string, error: Error = null, moreArgs: unknown[] = []): void {
		this.log(Level.DEBUG, label, message, moreArgs, error);
	}

	public info(label: string, message: string, error: Error = null, moreArgs: unknown[] = null): void {
		this.log(Level.INFO, label, message, moreArgs, error);
	}

	public warn(label: string, message: string, error: Error = null, moreArgs: unknown[] = []): void {
		this.log(Level.WARN, label, message, moreArgs, error);
	}

	public error(label: string, message: string, error: Error = null, moreArgs: unknown[] = []): void {
		this.log(Level.ERROR, label, message, moreArgs, error);
	}

	public fatal(label: string, message: string, error: Error = null, moreArgs: unknown[] = []): void {
		this.log(Level.FATAL, label, message, moreArgs, error);
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
