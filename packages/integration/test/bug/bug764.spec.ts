import { argumentsBuilder, Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, test } from '@jest/globals';

const EXPECTED_BODY_BEFORE: string = `<!--SS--><!--SE--><div>
				<ul>
				<li>Login</li>
				<li hidden="">Home</li>
				<li hidden="">About</li>
				<li hidden="">Contact</li>
			</ul>
				<!--Empty-->
				<footer>
				<p>The footer</p>
			</footer>
			</div><!--SS--><!--SE-->`;

const EXPECTED_BODY_AFTER: string = `<!--SS--><!--SE--><div>
				<ul>
				<li hidden="">Login</li>
				<li>Home</li>
				<li>About</li>
				<li>Contact</li>
			</ul>
				<!--Empty-->
				<footer>
				<p>The footer</p>
			</footer>
			</div><!--SS--><!--SE-->`;

class Menu extends Component {

	private loggedIn: boolean;

	constructor() {
		super(`
			<ul>
				<li c-hidden="m().loggedIn">Login</li>
				<li c-hidden="!m().loggedIn">Home</li>
				<li c-hidden="!m().loggedIn">About</li>
				<li c-hidden="!m().loggedIn">Contact</li>
			</ul>
		`);
		this.loggedIn = false;
	}

	public setLoggedIn(value: boolean): void {
		this.loggedIn = value;
		this.$c().sync();
	}

}

class Footer extends Component {

	constructor() {
		super(`
			<footer>
				<p>The footer</p>
			</footer>
		`);
	}

}

class App extends Component {

	constructor() {
		super(`
			<div>
				<c-region name="menu" path="menu"></c-region>
				<c-region name="body"></c-region>
				<c-region name="footer" path="footer"></c-region>
			</div>
		`);
	}

}

describe("Bug 764 - Component digestion when sync called", () => {

	test.skip("Root component is populated with active behaviors", () => {
		const harness: Harness<App> = new Harness<App>(() => new App());
		harness.registerSingleton("menu", Menu);
		harness.registerSingleton("footer", Footer);
		harness.start();
		harness.expectBody().toEqual(EXPECTED_BODY_BEFORE);
		const menu: Menu = harness.getComponent().$c().regions().get("menu");
		menu.setLoggedIn(true);
		harness.expectBody().toEqual(EXPECTED_BODY_AFTER);
	});

});
