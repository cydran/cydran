import { Component } from "cydran";
import TEMPLATE from "./ModalContainer.html";

interface ModalParams {
	name: string;
	title: string;
	closeable: boolean;
}

class ModalContainer extends Component {

	private title: string;

	private visible: boolean;

	private closeable: boolean;

	constructor() {
		super(TEMPLATE);
		this.$c().onMessage('show').forChannel('modal').invoke(this.showModal);
		this.$c().onMessage('hide').forChannel('modal').invoke(this.hideModal);
		this.title = 'Modal Dialog';
		this.visible = false;
		this.closeable = false;
	}

	public showModal(payload: ModalParams) {
		this.$c().getLogger().info('Modal opening');
		this.$c().regions().setFromRegistry('body', payload.name);
		this.title = payload.title;
		this.closeable = payload.closeable;
		this.visible = true;
	}

	public hideModal() {
		this.$c().getLogger().info('Modal closing');
		this.visible = false;
		this.$c().regions().set('body', null);
	}
}

export default ModalContainer;
