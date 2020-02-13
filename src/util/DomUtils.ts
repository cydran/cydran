import Properties from "@/config/Properties";

// TODO - Refactor this

const domReady = function(callback) {
	let ready = false;
	const WIN = Properties.getWindow();
	const DOC = WIN.document;

	const detach = function() {
		if (DOC.addEventListener) {
			DOC.removeEventListener("DOMContentLoaded", completed);
			WIN.removeEventListener("load", completed);
		} else {
			WIN["detachEvent"]("onreadystatechange", completed);
			WIN["detachEvent"]("onload", completed);
		}
	};

	const completed = function() {
		if (!ready && (DOC.addEventListener || event.type === "load" || DOC.readyState === "complete")) {
			ready = true;
			detach();
			callback();
		}
	};

	if (DOC.readyState === "complete") {
		callback();
	} else if (DOC.addEventListener) {
		DOC.addEventListener("DOMContentLoaded", completed);
		WIN.addEventListener("load", completed);
	} else {
		DOC["attachEvent"]("onreadystatechange", completed);
		WIN["attachEvent"]("onload", completed);

		let top = false;

		try {
			top = (WIN.frameElement == null && DOC.documentElement) ? true : false;
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
	domReady: domReady
};

export default result;
