import Logger from 'log/Logger';

import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

function getLogger(key: string, label?: string): Logger {
	requireNotNull(key, "key");

	return GlobalContextHolder.getContext().getObject("logger", key, label);
}

export default getLogger;