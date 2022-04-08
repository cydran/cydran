import SimpleMap from "interface/SimpleMap";

interface Bundle extends SimpleMap<BundleContext> {
	// Intentionally empty
}

interface BundleContext extends SimpleMap<BundleCategory> {
	// Intentionally empty
}

interface BundleCategory extends SimpleMap<BundleGroup> {
	// Intentionally empty
}

interface BundleGroup extends SimpleMap<BundleItem> {
	// intentionally empty
}

interface BundleItem extends SimpleMap<string> {
	// Intentionally empty
}

export { Bundle, BundleContext, BundleGroup, BundleCategory, BundleItem };
