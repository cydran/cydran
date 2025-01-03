import Logger from 'log/Logger';

import LoggerImpl from "log/LoggerImpl";
import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

function getLogger(key: string, label?: string): Logger {
	requireNotNull(name, "name");

	return GlobalContextHolder.getContext().getObject("logger", key, label); //
}

export default getLogger;