import { Component, Events, requireNotNull } from "@cydran/cydran";
import TEMPLATE from "./Blog.html";
import BlogService from "../service/BlogService";

interface Post {

	id: string;

	title: string;

	body: string;

}

class Blog extends Component {

	private blogService: BlogService;

	private idCounter: number;

	private loading: boolean;

	private post: Post;

	private posts: Post[];

	private provider: () => Component;

	constructor(blogService: BlogService, somethingCool: string, provider: () => Component) {
		super(TEMPLATE, { prefix: "b" });
		this.blogService = requireNotNull(blogService, "blogService");
		this.provider = requireNotNull(provider, "provider");
		this.$c().onMessage(Events.AFTER_PARENT_ADDED).invoke(this.load);
		this.$c().onMessage("updated").forChannel("blog").invoke(this.blogUpdated);
		this.$c().onMessage("error").forChannel("blog").invoke(this.blogError);
		this.posts = [
			{
				id: "1",
				title: "An immutable post",
				body: "Body text"
			}
		];
		this.idCounter = 0;
		this.loading = false;
		this.resetPost();
		this.$c().getLogger().info(somethingCool);
	}

	public blogUpdated(data: any): void {
		this.$c().getLogger().debug(data);
		this.posts = data;
		this.loading = false;
	}

	public blogError(error: any): void {
		this.$c().getLogger().error(error);
		this.loading = false;
	}

	public load(): void {
		this.$c().getLogger().info("loading");
		this.blogService.load();
		this.loading = true;
	}

	public add(): void {
		this.posts.push(this.post);
		this.resetPost();
	}

	private resetPost(): void {
		this.post = {
			body: "",
			id: ++this.idCounter + "",
			title: "",
		};
	}

	public handleClick(): void {
		console.log(this.provider());
	}

}

export default Blog;
