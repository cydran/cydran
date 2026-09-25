import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./Modals.html";

class Modals extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public popModal(): void {
		this.$c().send('show', {
			title: 'Confirmation 1',
			name: 'helloWorld',
			closeable: true
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

	public popOtherModal(): void {
		this.$c().send('show', {
			title: 'Confirmation 1',
			name: 'helloWorld2',
			closeable: false
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

	public popBlogModal(): void {
		this.$c().send('show', {
			title: "Blog",
			name: "wazzup",
			closeable: true
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

}

export default Modals;
