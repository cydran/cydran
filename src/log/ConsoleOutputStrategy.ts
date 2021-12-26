import OutputStrategy from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { isDefined } from "util/Utils";
import { PropertyKeys } from "Constants";
import SimpleMap from "interface/SimpleMap";

const colorPfx: string = PropertyKeys.CYDRAN_LOGGING_COLOR_PREFIX as const;
const getNow = (): string => {
	const now = new Date();
	return `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}:${now.getUTCMilliseconds()}`;
};

type OutColor = {orig: string, alt: string};

class ConsoleOutputStrategy implements OutputStrategy {
	private wkColors: SimpleMap<OutColor> = {
		WARN: {orig: 'ff9400', alt: null},
		TRACE: {orig: "ffd478", alt: null},
		FULLSTACK: {orig: "ff2f92", alt: null},
		DEBUG: {orig: "008e00", alt: null},
		INFO: {orig: "0096ff", alt: null}
	};

	public constructor(props?: Properties) {
		if(isDefined(props)) {
			this.updateColorPallet(props);
		}
	}

	public updateColorPallet(props: Properties) {
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

		const preamble: string = `${ getNow() } [${ Level[level] }] [${ logName }]`;
		const shortArgs: boolean = payload instanceof Error;
		const printFullStack: boolean = !(stacked instanceof Error) ? (null !== stacked ? stacked : false) : false;

		if (level >= Level.WARN) {
			const logMsg: string = shortArgs ? payload.stack : payload;
			const errMsg: string = stacked instanceof Error ? stacked.message : "";

			switch (level) {
				case Level.WARN:
					// tslint:disable-next-line
					console.log(`%c${preamble} ${logMsg}`, `color:${this.getColor(level)}`);
					break;
				case Level.ERROR:
				case Level.FATAL:
				default:
					// tslint:disable-next-line
					console.error(`${preamble} ${errMsg} - ${logMsg}`);
					break;
			}
		} else {
			let color: string = null;
			switch (level) {
				case Level.TRACE:
				case Level.DEBUG:
				case Level.INFO:
					color = this.getColor(level);
					break;
			}

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
