import { OutputStrategy } from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { defaulted, isDefined, padText } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import { PropertyKeys } from "CydranConstants";
import PropertiesImpl from "properties/PropertiesImpl";

const colorPfx: string = PropertyKeys.CYDRAN_LOG_COLOR_PREFIX as const;
const getNow = (): string => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

type OutColor = {orig: string, alt: string};

class ConsoleOutputStrategy implements OutputStrategy {

	private preambleOrder: string[];

	private wkColors: SimpleMap<OutColor> = {
		WARN: {orig: '#ff9400', alt: null},
		TRACE: {orig: "#ffd478", alt: null},
		FULLSTACK: {orig: "#ff2f92", alt: null},
		DEBUG: {orig: "#008e00", alt: null},
		INFO: {orig: "#0096ff", alt: null}
	};

	private static readonly id: string = "default";

	private console: Console;

	public constructor(props?: Properties, consoleInstance?: Console) {
		this.console = defaulted(consoleInstance, console);
		this.preambleOrder = "time:level:name".split(":");
		this.setPreferences(props);
	}

	public trace(name: string, payload: any, error?: Error): void {
		this.processLessUrgent(name, payload, Level.TRACE, error);
	}

	public debug(name: string, payload: any, error?: Error): void {
		this.processLessUrgent(name, payload, Level.DEBUG, error);
	}

	public info(name: string, payload: any, error?: Error): void {
		this.processLessUrgent(name, payload, Level.INFO, error);
	}

	public warn(name: string, payload: any, error?: Error): void {
		this.processMoreUrgent(name, payload, Level.WARN, error);
	}

	public error(name: string, payload: any, error?: Error): void {
		this.processMoreUrgent(name, payload, Level.ERROR, error);
	}

	public fatal(name: string, payload: any, error?: Error): void {
		this.processMoreUrgent(name, payload, Level.FATAL, error);
	}

	private processMoreUrgent(name: string, payload: any, wkLevel: Level, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, wkLevel);
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;

		const shortArgs: boolean = payload instanceof Error;
		const logMsg: string = (shortArgs && printFullStack) ? payload.stack : payload;
		const errMsg: string = stackedIsErr ? stacked['message'] : "";
		this.doWrite(wkLevel, `%c${ preamble }`, `color:${ this.getColor(wkLevel.toString()) }`, `${ errMsg }`, `${ logMsg }`);
	}

	private processLessUrgent(name: string, payload: any, wkLevel: Level, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, wkLevel);
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;
		const color: string = this.resolveColorStringValue(printFullStack, wkLevel);
		this.doWrite(wkLevel, `%c${ preamble }`, `color:${ color }`, payload);
	}

	private doWrite(level: Level, msg: string, ...otherArgs: any): void {
		switch(level) {
			case Level.TRACE:
			case Level.DEBUG:
			case Level.INFO:
				this.console.log(msg, otherArgs);
				break;
			case Level.WARN:
				this.console.warn(msg, otherArgs);
				break;
			case Level.FATAL:
			case Level.ERROR:
				this.console.error(msg, otherArgs);
				break;
			default:
				break;
		}
	}

	private getColor(lvl: string) {
		const wkLvl: string = Level[lvl];
		return this.wkColors[wkLvl]?.alt || this.wkColors[wkLvl]?.orig || "";
	}

	private resolveColorStringValue(pFullStk: boolean, lvl: Level) {
		return (pFullStk) ? this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig: this.getColor(lvl.toString());
	}

	public getId(): string {
		return ConsoleOutputStrategy.id;
	}

	public setPreferences(props: Properties): void {
		if(isDefined(props)) {
			this.preambleOrder = props.getAsString(PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER)?.split(":") || this.preambleOrder;
			this.updateColorPallet(props);
		}
	}

	public updateColorPallet(props: Properties = new PropertiesImpl()) {
		Object.keys(this.wkColors).forEach((key: string) => {
			const shortKey: string = key.toLowerCase();
			const wkKey: string = `${colorPfx}.${shortKey}`;
			if(props.isDefined(wkKey)) {
				this.wkColors[key].alt = props.getAsString(wkKey);
			}
		});
	}

	public log(logName: string, level: Level, payload: any, stacked: Error | boolean = false): void {
		switch(level) {
			case Level.DISABLED:
				return;
			case Level.TRACE:
				this.trace(logName, payload, stacked as Error);
				break;
			case Level.DEBUG:
				this.debug(logName, payload, stacked as Error);
				break;
			case Level.INFO:
				this.info(logName, payload, stacked as Error);
				break;
			case Level.WARN:
				this.warn(logName, payload, stacked as Error);
				break;
			case Level.ERROR:
				this.error(logName, payload, stacked as Error);
				break;
			case Level.FATAL:
				this.fatal(logName, payload, stacked as Error);
				break;
		}
	}

	private createPreamble(logName: string, lvl: string): string {
		let result: string = "";
		this.preambleOrder.forEach(tok => {
			switch(tok.toLowerCase()) {
				case "time":
					result += `${ getNow() } `;
					break;
				case "level":
					result += `[${ padText(Level[lvl], 5) }] `;
					break;
				case "name":
					result += `[ ${ logName } ] `;
					break;
			}
		});
		return result.trim();
	}

}

export default ConsoleOutputStrategy;
