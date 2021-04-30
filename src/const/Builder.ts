import { StageBuilder } from "stage/Stage";
import StageBuilderImpl from "stage/StageBulderImpl";

const builder = function (rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

export default builder;
