import { Component } from "@cydran/cydran";
import TEMPLATE from "./Svg.html";

class Svg extends Component {

	private color: string;

	private hideImage: boolean = true;

	constructor() {
		super(TEMPLATE);
		this.color = "#97c024";
		this.hideImage = true;
	}

	public toggleImage(): void {
		this.hideImage = !this.hideImage;
	}

}

export default Svg;
