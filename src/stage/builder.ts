import { StageBuilder } from "@/stage/Interfaces";
import StageBuilderImpl from "@/stage/StageBuilderImpl";

const builder = function(rootSelector: string): StageBuilder {
	return new StageBuilderImpl(rootSelector);
};

export default builder;