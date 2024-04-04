import axios from "axios";
import { PubSub, Logger, requireNotNull } from "@cydran/cydran";
import BlogService from "./BlogService";

class BlogServiceImpl implements BlogService {

	private pubSub: PubSub;

	private logger: Logger;

	constructor(logger: Logger, pubSub: PubSub) {
		this.logger = requireNotNull(logger, "logger");
		this.pubSub = requireNotNull(pubSub, "pubSub");
	}

	public load(): void {
		axios.get("/static/blog-posts.json")
			.then((response) => {
				this.logger.info(response.data.items);
				this.pubSub.sendGlobally('blog', "updated", response.data.items);
			}).catch((error) => {
				this.pubSub.sendGlobally('blog', "error", error);
			});
	}

}

export default BlogServiceImpl;
