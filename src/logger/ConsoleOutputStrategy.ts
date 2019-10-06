import Logger from "./Logger";
import Level from "./Level";
import OutputStrategy from "./OutputStrategy";

class ConsoleOutputStrategy implements OutputStrategy {

  public log(logger: Logger, level: Level, payload: any, error?: Error): void {
    const prefix = this.getNow() + " " + level + " [" + logger.getName() + "]";

    if (level != Level.ZERO) {
      if (error) {
        switch (level) {
          case Level.ERROR:
          case Level.FATAL:
          default:
            // tslint:disable-next-line
            console.error(prefix, error.stack);
            break;
        }
      } else {
        switch (level) {
          case Level.DEBUG:
            // tslint:disable-next-line
            console.debug(prefix, payload);
            break;
          case Level.INFO:
            // tslint:disable-next-line
            console.info(prefix, payload);
            break;
          case Level.TRACE:
            // tslint:disable-next-line
            console.trace(prefix, payload);
            break;
          default:
            // tslint:disable-next-line
            console.log(prefix, payload);
            break;
        }
      }
    }
  }

  private getNow(): string {
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

}

export default ConsoleOutputStrategy;
