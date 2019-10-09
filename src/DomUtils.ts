import { Properties } from "./Core";
// TODO - Refactor this

const domReady = function(callback) {
	let ready = false;

	const detach = function() {
		if (Properties.getWindow().document.addEventListener) {
			Properties.getWindow().document.removeEventListener("DOMContentLoaded", completed);
			Properties.getWindow().removeEventListener("load", completed);
		} else {
			document["detachEvent"]("onreadystatechange", completed);
			window["detachEvent"]("onload", completed);
		}
	};

	const completed = function() {
		if (!ready && (Properties.getWindow().document.addEventListener || event.type === "load" || Properties.getWindow().document.readyState === "complete")) {
			ready = true;
			detach();
			callback();
		}
	};

	if (Properties.getWindow().document.readyState === "complete") {
		callback();
	} else if (Properties.getWindow().document.addEventListener) {
		Properties.getWindow().document.addEventListener("DOMContentLoaded", completed);
		Properties.getWindow().addEventListener("load", completed);
	} else {
		Properties.getWindow().document["attachEvent"]("onreadystatechange", completed);
		Properties.getWindow()["attachEvent"]("onload", completed);

		let top = false;

		try {
			top = (Properties.getWindow().frameElement == null && Properties.getWindow().document.documentElement) ? true : false;
		} catch (e) {
			// Intentionally do nothing
		}

		if (top && top["doScroll"]) {
			(function scrollCheck() {
				if (ready) {
					return;
				}

				try {
					top["doScroll"]("left");
				} catch (e) {
					return setTimeout(scrollCheck, 50);
				}

				ready = true;
				detach();
				callback();
			})();
		}
	}
};

const result = {
	domReady: domReady,
};

export default result;
