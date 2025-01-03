import Logger from 'log/Logger';

import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

function getLogger(key: string, label?: string): Logger {
	requireNotNull(name, "name");

	return new LoggerAlternativeImpl(GlobalContextHolder.getContext(), key, label);
}

export default getLogger;