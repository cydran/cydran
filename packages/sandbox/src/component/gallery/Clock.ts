import { Component } from "@cydran/cydran";
import TEMPLATE from "./Clock.html";

class Clock extends Component {

	private time: {
		hour: number;
		minute: number;
		second: number;
		postMeridiem: boolean;
	};

	constructor() {
		super(TEMPLATE);
		this.time = {
			hour: 0,
			minute: 0,
			second: 0,
			postMeridiem: false
		};

		this.$c().onInterval(250).invoke(this.updateTime);
	}

	private updateTime(): void {
		const now: Date = new Date();
		const hour: number = now.getHours();
		const minute: number = now.getMinutes();
		const second: number = now.getSeconds();
		this.time.hour = hour > 12 ? hour - 12 : hour;
		this.time.minute = minute;
		this.time.second = second;
		this.time.postMeridiem = this.time.hour > 12;
		console.log("Updated: " + now.toUTCString());
	}

}

export default Clock;
