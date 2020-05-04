class Properties {

	public static setWindow(instance: Window): void {
		Properties.window = instance;
	}

	public static getWindow(): Window {
		return Properties.window || global["window"];
	}

	private static window: Window;

}

export default Properties;
