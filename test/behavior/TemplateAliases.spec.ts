import TemplateAliases from "behavior/TemplateAliases";
import { isDefined } from 'util/Utils';

const enumKeys: string[] = "v,value,m,model,p,param,compare".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: TemplateAliases = TemplateAliases[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case TemplateAliases.V:
			case TemplateAliases.VALUE:
			case TemplateAliases.M:
			case TemplateAliases.MODEL:
			case TemplateAliases.P:
			case TemplateAliases.PARAM:
			case TemplateAliases.COMPARE:
				expect(isDefined(TemplateAliases[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});

console.log(TemplateAliases["Bubba"]);
