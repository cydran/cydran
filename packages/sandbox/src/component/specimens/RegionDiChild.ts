import { Component } from "@cydran/cydran";
import TEMPLATE from "./RegionDiChild.html";

/**
 * DI-registered child (no constructor args) so it can be placed into a region via
 * `$c().regions().setByObjectId(name, "regionDiChild")`.
 */
class RegionDiChild extends Component {

	private tag: string;

	constructor() {
		super(TEMPLATE);
		this.tag = "DI";
	}

}

export default RegionDiChild;
