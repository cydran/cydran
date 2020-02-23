const VALID_ID: RegExp = /^[a-zA-Z][a-zA-Z0-9\$\@\-\_\.\:\\\/]*$/m;
const VALID_KEY: RegExp = new RegExp(/^[a-zA-Z\$\_][a-zA-Z0-9\$\_]*$/);

export { VALID_ID, VALID_KEY };
