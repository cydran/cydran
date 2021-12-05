import OutputStrategy from "log/OutputStrategy";
import Level from "log/Level";
import { Properties } from 'properties/Property';
import { isDefined } from "util/Utils";
import { PropertyKeys } from "Constants";
import SimpleMap from "interface/SimpleMap";

const colorPrefix: string = PropertyKeys.CYDRAN_LOGGING_COLOR_PREFIX as const;
enum LogColors {
	WARN = "warn",
	TRACE = "trace",
	FULLSTACK = "fullstack",
	DEBUG = "debug",
	INFO = "info"
}

class ConsoleOutputStrategy implements OutputStrategy {
	private static getNow(): string {
		const now = new Date();

		return `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}:${now.getUTCMilliseconds()}`;
	}

	private c: SimpleMap<any> = {};

	public setColorPallet(colors: Properties) {
		if(isDefined(colors)) {
			Object.keys(LogColors).forEach(key => {
				const fullKey: string = `${colorPrefix}.${LogColors[key]}`;
				if(colors.isDefined(fullKey)) {
					this.c[key.toLowerCase()] = colors.getAsString(fullKey);
				}
			});
		}
	}

	public log(logName: string, level: Level, payload: any, stacked?: Error | boolean): void {
		if (level === Level.DISABLED) {
			return;
		}

		const preamble: string = `${ ConsoleOutputStrategy.getNow() } [${ Level[level] }] [${ logName }]`;
		const shortArgs: boolean = payload instanceof Error;
		const printFullStack: boolean = !(stacked instanceof Error) ? (null !== stacked ? stacked : false) : false;

		if (level >= Level.WARN) {
			const logMsg: string = shortArgs ? payload.stack : payload;
			const errMsg: string = stacked instanceof Error ? stacked.message : "";

			switch (level) {
				case Level.WARN:
					// tslint:disable-next-line
					console.log(`%c${preamble} ${logMsg}`, `color:${this.c[LogColors.WARN]}`);
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
					color = printFullStack ? this.c[LogColors.FULLSTACK] : this.c[LogColors.TRACE];
					break;
				case Level.DEBUG:
					color = this.c[LogColors.DEBUG];
					break;
				case Level.INFO:
					color = this.c[LogColors.INFO];
					break;
			}
			if (color) {
				// tslint:disable-next-line
				console.log(`%c${preamble}`, `color:${color}`, payload);
			} else {
				// tslint:disable-next-line
				console.log(preamble, payload);
			}
		}
	}
}

export default ConsoleOutputStrategy;
