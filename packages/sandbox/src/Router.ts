/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Transmitter, To } from "@cydran/cydran";
import Navigo from "navigo";

interface Routes {

	[path: string]: (...routerArguments: unknown[]) => void;

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
			'specimens': () => {
				this.navigate('specimens');
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
		this.transmitter.send(To.GLOBALLY, 'navigation', 'navigate', name);
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
