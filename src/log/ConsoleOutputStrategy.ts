import OutputStrategy from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { isDefined } from "util/Utils";
import SimpleMap from "interface/SimpleMap";
import PropertyKeys from "const/PropertyKeys";
import PropertiesImpl from "properties/PropertiesImpl";

const colorPfx: string = PropertyKeys.CYDRAN_LOG_COLOR_PREFIX as const;
const getNow = (): string => {
	const now = new Date();
	return `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}:${now.getUTCMilliseconds()}`;
};

type OutColor = {orig: string, alt: string};

class ConsoleOutputStrategy implements OutputStrategy {
	private wkColors: SimpleMap<OutColor> = {
		WARN: {orig: '#ff9400', alt: null},
		TRACE: {orig: "#ffd478", alt: null},
		FULLSTACK: {orig: "#ff2f92", alt: null},
		DEBUG: {orig: "#008e00", alt: null},
		INFO: {orig: "#0096ff", alt: null}
	};

	private tag: string = "";
	private tagVisible: boolean = false;

	public constructor(props?: Properties) {
		if(isDefined(props)) {
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
		Object.keys(this.wkColors).forEach(key => {
			const shortKey: string = key.toLowerCase();
			const wkKey: string = `${colorPfx}.${shortKey}`;
			if(props.isDefined(wkKey)) {
				this.wkColors[key].alt = props.getAsString(wkKey);
			}
		});
	}

	public log(logName: string, level: Level, payload: any, stacked?: Error | boolean): void {
		if (level === Level.DISABLED) {
			return;
		}

		const wkLogName: string = (this.tagVisible && this.tag.length > 0) ? `${ this.tag }.${ logName }` : logName;
		const preamble: string = `${ getNow() } [${ Level[level] }] [${ wkLogName }]`;
		const shortArgs: boolean = payload instanceof Error;
		const printFullStack: boolean = isDefined(stacked) && !(stacked instanceof Error) && stacked;

		if (level >= Level.WARN) {
			const logMsg: string = shortArgs ? payload.stack : payload;
			const errMsg: string = stacked instanceof Error ? stacked.message : "";

			if(level === Level.WARN) {
				// tslint:disable-next-line
				console.log(`%c${preamble} ${logMsg}`, `color:${this.getColor(level)}`);
			} else {
				// tslint:disable-next-line
				console.error(`${preamble} ${errMsg} - ${logMsg}`);
			}
		} else {
			let color: string = this.getColor(level);
			if(printFullStack) {
				color = this.wkColors.FULLSTACK.alt || this.wkColors.FULLSTACK.orig;
			}
			// tslint:disable-next-line
			console.log(`%c${preamble}`, `color:${color}`, payload);
		}
	}

	private getColor(lvl: Level) {
		const wkLvl: string = Level[lvl];
		return this.wkColors[wkLvl].alt || this.wkColors[wkLvl].orig;
	}

}

export default ConsoleOutputStrategy;
