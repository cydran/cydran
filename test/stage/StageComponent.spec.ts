import StageComponent from "stage/StageComponent";
import Context from 'context/Context';
import ContextImpl from "context/ContextImpl";
import StageRendererImpl from "component/renderer/StageRendererImpl";

test.skip("instantiation and whole", () => {
	const spec: StageComponent = null;
	// TODO: fix
	// const renderer: Renderer = new StageRendererImpl(this.dom, this.rootSelector, this.topComponentIds, this.bottomComponentIds);
	// const context: ContextImpl = new ContextImpl()
	// this.root = new StageComponent(renderer, this.contexts.getDefaultContext());
	expect(spec).not.toBeNull();
});
