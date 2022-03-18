import i18n from "i18n/i18n";
import SimpleMap from "interface/SimpleMap";
import { asString } from "util/AsFunctions";
import { isDefined, padLeft, requireNotNull } from 'util/Utils';

function msg(code: number, params?: SimpleMap<string>) {
	requireNotNull(code, "code");
	const key: string = padLeft(asString(code), 5, "0");
	const text: string = i18n("cydran", "messages", "errors", key, params);
	const message: string = isDefined(text) ? `: ${text}` : "";

	return "ERROR-" + key + message;
}

export default msg;
