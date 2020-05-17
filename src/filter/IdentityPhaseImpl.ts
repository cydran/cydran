import Phase from "@/filter/Phase";

class IdentityPhaseImpl implements Phase {

	process(items: any[]): any[] {
		return items;
	}

}

export default IdentityPhaseImpl;
