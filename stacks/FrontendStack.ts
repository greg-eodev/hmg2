import * as sst from "@serverless-stack/resources";
import { Api, App, Stack, StackProps, ReactStaticSite } from "@serverless-stack/resources";

/**
 * #### Extended Stack Props
 * 
 * @param api                           BaseAPI object
 * @interface IFrontEndApiStackProps
 */
interface IFrontEndApiStackProps extends StackProps {
	readonly api: Api;
}

export default class FrontendStack extends Stack {
	constructor(scope: App, id:string, props: IFrontEndApiStackProps) {
		super(scope, id, props);

		const { api } = props;

		// Define our React app
		const site = new ReactStaticSite(this, "ReactSite", {
			customDomain: undefined,
			path: "web",
			// Pass in our environment variables
			environment: {
				REACT_APP_API_URL: api.customDomainUrl || api.url,
				REACT_APP_REGION: scope.region,
			},
		});

		this.addOutputs({
			SiteUrl: site.customDomainUrl || site.url,
		});
	}
}