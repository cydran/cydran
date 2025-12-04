import { Nestable } from "context/Context";
import { isDefined } from "util/Utils";

function bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
	return isDefined(first) && isDefined(second) && first.$c().getId() !== second.$c().getId();
}

export {
	bothPresentButDifferent
};