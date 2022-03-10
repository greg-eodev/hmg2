import ApiStack from "./ApiStack";
import FrontendStack from "./FrontendStack";
import { addAwsTags } from "../util/tools";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
	/**
	 * Set default Node runtime across all functions
	 */
	app.setDefaultFunctionProps({
		runtime: "nodejs14.x"
	});

	const apiStack = new ApiStack(app, "BaseApi");
	addAwsTags(apiStack, app.stage, [
			{ tag: "hmg:application", value: "hmg" },
			{ tag: "hmg:application:component", value: "api" }
		]
	);

	const frontendStack = new FrontendStack(app, "Web", {
		api: apiStack.api
	});
	addAwsTags(frontendStack, app.stage, [
			{ tag: "hmg:application", value: "hmg" },
			{ tag: "hmg:application:component", value: "website" }
		]
	);
}
