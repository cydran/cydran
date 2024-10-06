import Level from "log/Level";
import { Properties } from "properties/Property";
import { Appender } from "log/appender/Appender";

type StrategyResolver = () => OutputStrategy;

interface OutputStrategy extends Appender {

}

export { OutputStrategy, StrategyResolver };
