import SimpleMap from "interface/SimpleMap";
import { compositeArray, requireNotNull } from 'util/Utils';

// TODO - Move this to common text string sourcing

const messages: SimpleMap<string> = {
	"only-one-message": 'must have only one child <template {0}{1}type="{2}"> node/element.',
	"only-zero-or-one-message": 'must have only zero or one child <template {0}{1}type="{2}"> node/element.',
	"one-top-level": 'template definitions must only have one top-level tag in repeat on expression: {0} and markup: {1}',
	"other-than-template": 'Elements other than <template> are not allowed when the parent element has a {0} attribute present on an element as part of a Cydran component template',
	"non-white-space": `Non-white space text are not allowed when the parent element has a {0} attribute present on an element as part of a Cydran component template: {1}`
};

function msg(key: string, ...values: string[]): string {
	requireNotNull(key, "key");

	return compositeArray(messages[key], values);
}

export { msg };