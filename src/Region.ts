import View from "./Component";

class Region {

	private el:HTMLElement;

	private view:View;

	private parentView:View;

	constructor(parentView:View) {
		this.parentView = parentView;
	}

	public setEl(el:HTMLElement):void {
		this.el = el;
	}

	public setView(view:View):void {
		if (this.view) {
			this.view.dispose();
		}

		while (this.el.firstChild) {
    	this.el.removeChild(this.el.firstChild);
		}

		let child:HTMLElement = document.createElement('div');

		this.el.appendChild(child);

		this.view = view;
		this.view.setEl(child);
		this.view.setParentView(this.parentView);
	}

	public dispose() {
		if (this.view) {
			this.view.dispose();
		}
	}

}

export default Region;
