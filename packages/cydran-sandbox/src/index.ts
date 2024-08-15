import App from "./component/App";
import Router from "./Router";
import { argumentsBuilder, Context, Stage, StageImpl, Component, ElementComponent } from "cydran";
import behaviorCapability from "./behavior";
import { modalCapability } from "./component/";
import serviceCapability from "./service/";
import "./main.scss";
import { galleryCapability } from "./component/gallery/";
import BUNDLE from "./bundle.json";
import PROPERTIES from "./properties.json";
import HelloWorld from './component/HelloWorld';
import Home from './component/Home';
import Docs from './component/Docs';
import NotFound from './component/NotFound';
import Tutorials from './component/Tutorials';
import TutorialChild from './component/TutorialChild';
import Community from './component/Community';
import Blog from './component/Blog';
import Gallery from './component/Gallery';
import Hello from './component/Hello';
import Menu from './component/Menu';
import RepeatItem from './component/RepeatItem';
import Empty from './component/Empty';
import FOOTER_TEMPLATE from "./component/Footer.html";

function i18n(key: string) {
	return BUNDLE[key];
}

function rootCapability(context: Context) {
	context.configure(behaviorCapability);
	context.registerSingleton('router', Router, argumentsBuilder().withPubSub().build());
	context.getScope().add('bundle', BUNDLE);
	context.getScope().add('i18n', i18n);
	context.getScope().add('upper', (str: string) => str.toUpperCase());
	context.getScope().add('lower', (str: string) => str.toLowerCase());
	context.registerPrototype("menu", Menu);
	context.registerPrototype("tutorialChild", TutorialChild);
	context.registerPrototype("page:home", Home);
	context.registerPrototype("page:docs", Docs);
	context.registerPrototype("page:notFound", NotFound);
	context.registerSingleton("page:tutorials", Tutorials);
	context.registerPrototype("page:gallery", Gallery);
	context.registerPrototype("page:helloworld", Hello);
	context.registerPrototype("helloWorld2", Tutorials);
	context.registerPrototype('page:community', Community);
	context.registerPrototype("page:blog", Blog, argumentsBuilder().with("blogService").withProperty("something.cool").build());
	context.registerPrototype("helloWorld", HelloWorld);
	context.registerPrototype("repeatItem", RepeatItem);
	context.registerPrototype("repeatEmpty", Empty);
	context.registerPrototype("wazzup", Blog, argumentsBuilder().with("blogService").withProperty("something.cool").build());
	context.registerImplicit("footer", FOOTER_TEMPLATE);

	context.addChild("gallery", galleryCapability);
	context.addChild("services", serviceCapability);
}

class MyComponent extends ElementComponent {

	constructor() {
		super("<div><p>Hello World</p><button c-onclick='alert(\"This is a test\")'>Click Me</button></div>");
	}

}

customElements.define('my-component', MyComponent as CustomElementConstructor);

const stage: Stage = new StageImpl("body", PROPERTIES);
stage.getContext()
	.configure(rootCapability)
	//.configure(modalCapability)
	;

stage.addInitializer((stage: Stage) => {
	stage.getContext().addChild("Cydran:Components:Modal", modalCapability)
	stage.setComponent(new App());
	let router: Router = stage.getContext().getObject('router');

	router.start();
});

stage.start();
