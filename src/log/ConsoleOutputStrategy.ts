import OutputStrategy from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { isDefined, padRight } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import PropertyKeys from "const/PropertyKeys";
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
	private tag: string = "";
	private tagVisible: boolean = false;

	public constructor(props?: Properties) {
		this.preambleOrder = "time:level:name".split(":");
		this.setPreferences(props);
	}

	public getId(): string {
		return ConsoleOutputStrategy.id;
	}

	public setPreferences(props: Properties): void {
		if(isDefined(props)) {
			this.preambleOrder = props.getAsString(PropertyKeys.CYDRAN_LOG_PREAMBLE_ORDER)?.split(":") || this.preambleOrder;
			this.setTag(props.getAsString(PropertyKeys.CYDRAN_LOG_LABEL));
			this.setTagVisibility(props.get(PropertyKeys.CYDRAN_LOG_LABEL_VISIBLE));
			this.updateColorPallet(props);
		}
	}

	public setTag(tag: string): void {
		this.tag = (isDefined(tag) && tag.trim().length > 0) ? tag.trim() : "";
	}

	public setTagVisibility(visible: boolean = false): void {
		this.tagVisible = visible;
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
		}

		const wkLogName: string = (this.tagVisible && this.tag.length > 0) ? `${ this.tag }.${ logName }` : logName;
		const preamble: string = this.setPreamble(wkLogName, level);
		const stackedIsErr: boolean = (stacked instanceof Error);
		const printFullStack: boolean = !stackedIsErr && !!stacked;

		if (level >= Level.WARN) {
			const shortArgs: boolean = payload instanceof Error;
			const logMsg: string = (shortArgs && printFullStack) ? payload.stack : payload;
			const errMsg: string = stackedIsErr ? stacked['message'] : "";
			const logMethod: string = (level === Level.FATAL) ? "error" : Level[level].toLowerCase();
			// tslint:disable-next-line
			console[logMethod](`%c${ preamble }`, `color:${ this.getColor(level) }`, `${ errMsg }`, `${ logMsg }`);
		} else {
			const color: string = (printFullStack) ? this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig: this.getColor(level);
			// tslint:disable-next-line
			console.log(`%c${ preamble }`, `color:${ color }`, payload);
		}
	}

	private setPreamble(logName: string, lvl: Level): string {
		let result: string = "";
		this.preambleOrder.forEach(tok => {
			switch(tok.toLowerCase()) {
				case "time":
					result += `${ getNow() } `;
					break;
				case "level":
					result += `[${ padRight(Level[lvl], 5) }] `;
					break;
				case "name":
					result += `[ ${ logName } ] `;
					break;
			}
		});
		return result.trim();
	}

	private getColor(lvl: Level) {
		const wkLvl: string = Level[lvl];
		return this.wkColors[wkLvl]?.alt || this.wkColors[wkLvl]?.orig || "";
	}

}

export default ConsoleOutputStrategy;
