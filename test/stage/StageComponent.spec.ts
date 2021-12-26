import StageComponent from "stage/StageComponent";
import { Module } from 'module/Module';
import ModuleImpl from "module/ModuleImpl";
import StageRendererImpl from "component/renderer/StageRendererImpl";

test.skip("instantiation and whole", () => {
	const spec: StageComponent = null;
	// TODO: fix
	// const renderer: Renderer = new StageRendererImpl(this.dom, this.rootSelector, this.topComponentIds, this.bottomComponentIds);
	// const module: ModuleImpl = new ModuleImpl()
	// this.root = new StageComponent(renderer, this.modules.getDefaultModule());
	expect(spec).not.toBeNull();
});
