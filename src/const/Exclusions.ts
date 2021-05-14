import SimpleMap from "interface/SimpleMap";

const EXCLUSIONS: SimpleMap<string> = {
	v: "v",
	value: "value",
	m: "m",
	model: "model",
	p: "p",
	parent: "param",
	compare: "compare"
};

export default EXCLUSIONS;