import { HttpClientError } from "error/Errors";
import ResourceRetriever from "interface/ResourceRetriever";

class SimpleHttpClientImpl implements ResourceRetriever {

	constructor() {
		// nothing for now
	}

	public resource(url: string, callback: Function, method: string = "GET"): any {
		const xhr: XMLHttpRequest = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.onreadystatechange = () => {
			if( xhr.readyState === XMLHttpRequest.DONE) {
				const status = xhr.status;
				if(status === 0 || status >= 200 && status < 400) {
					callback(xhr.response);
				} else {
					throw new HttpClientError(`${xhr.status} - ${xhr.statusText}`);
				}
			}
		};
		xhr.onerror = (err) => {
			throw new HttpClientError(err["message"]);
		};
		xhr.send();
	}
}

export default SimpleHttpClientImpl;
