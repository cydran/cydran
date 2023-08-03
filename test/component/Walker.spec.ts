import ComponentInternalsImpl from 'component/ComponentInternalsImpl';
import Context from 'context/Context';
import Walker from "component/Walker";
import DomUtils from "dom/DomUtils";
import Component from 'component/Component';
import { StageImpl } from 'context/RootContextImpl';
import InternalComponentOptions from "component/InternalComponentOptions";

const template: string = "<div>stuff to do<!-- other stuff --></div>";
class TestComponent extends Component {
	private testItems: string[] = ["Jack", "Jill", "Billy", "Suzy"];
	constructor() {
		super(template);
	}
}

const context: Context = new StageImpl("body");
const opts: InternalComponentOptions = { 'context': context };
const testComponent: Component = new TestComponent();

let cii: ComponentInternalsImpl = null;

beforeEach(() => {
	cii = new ComponentInternalsImpl(testComponent, template, opts);
});

afterEach(() => {
	cii = null;
});

test("Walker exists", () => {
	const wkSpy = jest.spyOn(Walker, 'walk');
	const rootElem: Element = DomUtils.createElement("div");
	const textNode: Text = DomUtils.createTextNode("something here to read");
	const commentNode: Comment = DomUtils.createComment("nothing goes here - placeholder");
	rootElem.appendChild(textNode);
	rootElem.appendChild(commentNode);

	Walker.walk(rootElem, cii);
	expect(wkSpy).toHaveBeenCalledTimes(1);
});