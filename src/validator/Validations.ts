import { VALID_ID, VALID_KEY } from "const/HardValues";
import { isDefined } from 'util/Utils';

const validateDefined: (value: any) => string = (value: any) => isDefined(value) ? null : "must be defined";

const validateValidKey: (value: any) => string = (value: any) => !isDefined(value) || VALID_KEY.test(value) ? null : "must be valid key";

const validateValidId: (value: any) => string = (value: any) => !isDefined(value) || VALID_ID.test(value) ? null : "must be valid id";

export { validateDefined, validateValidKey, validateValidId };
