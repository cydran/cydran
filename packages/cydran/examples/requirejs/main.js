requirejs.config({
	paths: {
		"dist": "../../dist"
	}
});

requirejs(["dist/cydran", "App"], function(c, App) {
	cydran.builder("#app")
		.withInitializer(function() {
			this.setComponent(new App());
		})
		.build()
		.start();
});
