import axios from "axios";
import { Transmitter, Logger, requireNotNull, To } from "@cydran/cydran";
import BlogService from "./BlogService";

class BlogServiceImpl implements BlogService {

	private transmitter: Transmitter;

	private logger: Logger;

	constructor(logger: Logger, transmitter: Transmitter) {
		this.logger = requireNotNull(logger, "logger");
		this.transmitter = requireNotNull(transmitter, "transmitter");
	}

	public load(): void {
		axios.get("/static/blog-posts.json")
			.then((response) => {
				this.logger.info(response.data.items);
				this.transmitter.send(To.GLOBALLY, 'blog', "updated", response.data.items);
			}).catch((error) => {
				this.transmitter.send(To.GLOBALLY, 'blog', "error", error);
			});
	}

}

export default BlogServiceImpl;
