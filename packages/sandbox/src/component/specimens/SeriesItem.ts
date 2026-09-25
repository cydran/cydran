import { Component } from "@cydran/cydran";
import TEMPLATE from "./SeriesItem.html";

/**
 * A minimal child component used as an element within a `<c-series>`. Each instance
 * renders its own `label`, so tests can assert both count and order of the series.
 */
class SeriesItem extends Component {

	private label: string;

	constructor(label: string) {
		super(TEMPLATE);
		this.label = label;
	}

}

export default SeriesItem;
