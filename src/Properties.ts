class Properties {

	public static setWindow(window: Window): void {
		Properties.window = window;
	}

	public static getWindow(): Window {
		return Properties.window;
	}

	private static window: Window;

}

Properties.setWindow(global["window"]);

export default Properties;
