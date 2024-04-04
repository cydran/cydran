#!/usr/bin/env node

const Ajv = require("ajv");
const validator = new Ajv();

const schema = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string"}
  },
  required: ["foo"],
  additionalProperties: false
};

const data = {
	foo: 1,
	bar: "abc"
};

const valid = validator.validate(schema, data);

if (!valid) {
	console.log(validator.errors);
}