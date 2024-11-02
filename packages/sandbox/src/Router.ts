import { Transmitter } from "@cydran/cydran";
import Navigo from "navigo";

interface Routes {

	[path: string]: Function;

}

class Router {

	private routes: Routes;

	private router: Navigo;

	private transmitter: Transmitter;

	constructor(transmitter: Transmitter) {
		this.transmitter = transmitter;
		let url = window.location.protocol + '//' + window.location.hostname;

		if (window.location.port) {
			url += ':';
			url += window.location.port;
		}

		this.router = new Navigo(url, true, '#');

		this.routes = {
			'/': () => {
				this.navigate('home');
			},
			'docs': () => {
				this.navigate('docs');
			},
			'tutorials': () => {
				this.navigate('tutorials');
			},
			'community': () => {
				this.navigate('community');
			},
			'gallery': () => {
				this.navigate('gallery');
			},
			'blog': () => {
				this.navigate('blog');
			},
			'helloworld': () => {
				this.navigate('helloworld');
			},
			'test/:id': (data: number | string) => {
				console.log('first');
				console.log(data);
			}
		};

	}

	private navigate(name: string): void {
		this.transmitter.sendGlobally('navigation', 'navigate', name);
	}

	public start(): void {
		this.router
			.notFound(() => {
				this.navigate('notFound');
			})
			.on(this.routes).resolve();
	}

}

export default Router;
