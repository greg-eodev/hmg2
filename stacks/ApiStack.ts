import { Api, App, Stack, StackProps } from "@serverless-stack/resources";
import { customLambdaName } from "../util/staging";

class ApiStack extends Stack {
	public readonly api: Api;

	constructor(scope: App, id: string, props?: StackProps) {
		super(scope, id, props);

		this.api = new Api(this, "Api", {
			defaultFunctionProps: {
				timeout: 30,
				environment: {
					DISABLE_XRAY_FOR_LOCAL: <string>(process.env.DISABLE_XRAY_FOR_LOCAL ? process.env.DISABLE_XRAY_FOR_LOCAL : ""),
					AWS_XRAY_CONTEXT_MISSING: <string>(process.env.DISABLE_XRAY_FOR_LOCAL ? "LOG_ERROR" : "RUNTIME_ERROR")
				}
			},
			routes: {
				"GET   /": {
					function: {
						srcPath: "src/",
						handler: "get.main",
						functionName: customLambdaName('API-get', scope.stage)
					}
				}
			},
		});

		this.addOutputs({
			"ApiEndpoint": this.api.url,
		});
	}
}

export default ApiStack;
