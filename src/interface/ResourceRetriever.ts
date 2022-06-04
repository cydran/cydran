interface ResourceRetriever {

	resource(url: string, callback: Function, method?: string): any;

}

export default ResourceRetriever;
