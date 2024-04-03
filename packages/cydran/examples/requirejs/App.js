define(["dist/cydran"], function(c) {

	const Component = c.Component;

	class App extends Component {
		constructor() {
			super("<p>Hello World</p>");
		}
	}

	return App;
});