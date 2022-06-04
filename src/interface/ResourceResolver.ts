interface ResourceResolver {

	resource(url: string, callback: Function, method?: string): any;

}

export default ResourceResolver;
