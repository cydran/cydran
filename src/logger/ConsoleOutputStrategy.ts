import Level from "./Level";
import Logger from "./Logger";
import OutputStrategy from "./OutputStrategy";

class ConsoleOutputStrategy implements OutputStrategy {

	private static getNow(): string {
		const now = new Date();

		return now.getUTCFullYear()
			+ "-"
			+ now.getUTCMonth()
			+ ":"
			+ now.getUTCDate()
			+ ":"
			+ now.getUTCHours()
			+ ":"
			+ now.getUTCMinutes()
			+ ":"
			+ now.getUTCSeconds()
			+ ":"
			+ now.getUTCMilliseconds();
	}

	public log(logger: Logger, level: Level, payload: any, error?: Error): void {

		if (level !== Level.DISABLE) {
			const wkTStamp = ConsoleOutputStrategy.getNow();
			const preamble = wkTStamp + " " + level + " [" + logger.getName() + "] %s";

			if (level >= Level.WARN) {
				const shortArgs = payload instanceof Error;
				const logMsg = (shortArgs ? payload.stack : payload);
				const errMsg = (error) ? error.stack : (!shortArgs ? "- FYI only and NOT an error" : "");

				switch (level) {
					case Level.WARN:
						// tslint:disable-next-line
						console.warn("%c" + preamble + (shortArgs ? "" : ((error) ? " - %s" : "")), "color:#ff2f92", logMsg, errMsg);
						break;
					case Level.ERROR:
					case Level.FATAL:
					default:
						// tslint:disable-next-line
						console.error(preamble + (shortArgs ? "" : ((error) ? " - %s" : "")), logMsg, errMsg);
						break;
				}
			} else {
				switch (level) {
					case Level.DEBUG:
						// tslint:disable-next-line
						console.debug(preamble, payload);
						break;
					case Level.INFO:
						// tslint:disable-next-line
						console.info(preamble, payload);
						break;
					case Level.TRACE:
						// tslint:disable-next-line
						console.trace(preamble, payload);
						break;
					default:
						// tslint:disable-next-line
						console.log(preamble, payload);
						break;
				}
			}
		}
	}

}

export default ConsoleOutputStrategy;
