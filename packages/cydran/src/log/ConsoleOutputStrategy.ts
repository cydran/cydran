import { OutputStrategy } from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { defaulted, isDefined, padRight } from "util/Utils";
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
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "TRACE");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;
		const color: string = (printFullStack) ? this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig: this.getColor("TRACE");
		this.console.log(`%c${ preamble }`, `color:${ color }`, payload);
	}

	public debug(name: string, payload: any, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "DEBUG");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;
		const color: string = (printFullStack) ? this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig: this.getColor("DEBUG");
		this.console.log(`%c${ preamble }`, `color:${ color }`, payload);
	}

	public info(name: string, payload: any, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "INFO");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;
		const color: string = (printFullStack) ? this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig: this.getColor("INFO");
		this.console.log(`%c${ preamble }`, `color:${ color }`, payload);
	}

	public warn(name: string, payload: any, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "WARN");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;

		const shortArgs: boolean = payload instanceof Error;
		const logMsg: string = (shortArgs && printFullStack) ? payload.stack : payload;
		const errMsg: string = stackedIsErr ? stacked['message'] : "";
		this.console.warn(`%c${ preamble }`, `color:${ this.getColor("WARN") }`, `${ errMsg }`, `${ logMsg }`);
	}

	public error(name: string, payload: any, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "ERROR");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;

		const shortArgs: boolean = payload instanceof Error;
		const logMsg: string = (shortArgs && printFullStack) ? payload.stack : payload;
		const errMsg: string = stackedIsErr ? stacked['message'] : "";
		this.console.error(`%c${ preamble }`, `color:${ this.getColor("ERROR") }`, `${ errMsg }`, `${ logMsg }`);
	}

	public fatal(name: string, payload: any, error?: Error): void {
		const stacked: Error | boolean = isDefined(error) ? error : false;
		const preamble: string = this.createPreamble(name, "FATAL");
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;

		const shortArgs: boolean = payload instanceof Error;
		const logMsg: string = (shortArgs && printFullStack) ? payload.stack : payload;
		const errMsg: string = stackedIsErr ? stacked['message'] : "";
		this.console.error(`%c${ preamble }`, `color:${ this.getColor("FATAL") }`, `${ errMsg }`, `${ logMsg }`);
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
		if (level === Level.DISABLED) {
			return;
		} else if (level === Level.TRACE) {
			this.trace(logName, payload, stacked as Error);
		} else if (level === Level.DEBUG) {
			this.debug(logName, payload, stacked as Error);
		} else if (level === Level.INFO) {
			this.info(logName, payload, stacked as Error);
		} else if (level === Level.WARN) {
			this.warn(logName, payload, stacked as Error);
		} else if (level === Level.ERROR) {
			this.error(logName, payload, stacked as Error);
		} else if (level === Level.FATAL) {
			this.fatal(logName, payload, stacked as Error);
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
					result += `[${ padRight(Level[lvl], 5, " ") }] `;
					break;
				case "name":
					result += `[ ${ logName } ] `;
					break;
			}
		});
		return result.trim();
	}

	private getColor(lvl: string) {
		const wkLvl: string = Level[lvl];
		return this.wkColors[wkLvl]?.alt || this.wkColors[wkLvl]?.orig || "";
	}

}

export default ConsoleOutputStrategy;
