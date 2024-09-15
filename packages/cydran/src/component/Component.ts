import ComponentInternalsImpl from "component/ComponentInternalsImpl";
import ComponentOptions from "component/ComponentOptions";
import InternalComponentOptions from "component/InternalComponentOptions";
import Renderer from "component/Renderer";
import ComponentInternals from "component/ComponentInternals";
import { ActionContinuation, Nestable } from "interface/ComponentInterfaces";
import { Context } from "context/Context";

class Component implements Nestable {

	// eslint:disable-next-line
	private ____internal$$cydran____: ComponentInternals;

	/**
	 * Constructor
	 * @param template - string value representation of a template
	 * @param options - optional {@link ComponentOptions} argument
	 */
	constructor(template: string | HTMLElement | Renderer, options?: ComponentOptions) {
		this.____internal$$cydran$$init____(template, options as InternalComponentOptions);
	}

	public setContext(context: Context): void {
		this.____internal$$cydran____.setContext(context);
	}

	/**
	 * Activity to execute when the component is mounted on the {@linkcode Stage } for the first time
	 */
	 public onMount(): void {
		// Intentionally do nothing by default
	}

	/**
	 * Activity to execute when the component is un-mounted from the {@linkcode Stage }
	 */
	 public onUnmount(): void {
		// Intentionally do nothing by default
	}

	/**
	 * Activity to execute when the component is re-mounted on the {@linkcode Stage }
	 */
	public onRemount(): void {
		// Intentionally do nothing by default
	}

	public $c(): ActionContinuation {
		return this.____internal$$cydran____.$c();
	}

	protected ____internal$$cydran$$init____(template: string | HTMLElement | Renderer, options: InternalComponentOptions): void {
		this.____internal$$cydran____ = new ComponentInternalsImpl(this, template, options);
		this.____internal$$cydran____.postConstruct();
	}

}

export default Component;
