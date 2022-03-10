import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { infoTag } from "./tools";
import Debug from "../class/debug/Debug";
import { Handler } from "../config/types";
import AWSXRay from "aws-xray-sdk";
/**
 * #### Lambda Function Handler
 *
 * Determine if XRay instrumentation is enabled (actually not disabled)
 * + XRay enabled
 * + wrap all SDK, HTTP, and HTTPS downstream activity for tracing
 * + also create a named trace subsegment to accumulate all downstream activity
 * 
 * + XRay disabled
 * + process the lambda function as normal without wrappinggs
 * 
 * @param lambda 						lamdba function
 * @returns 							HTTP reponse
 */
const handler = (lambda: Handler) => {
	if (typeof process.env.DISABLE_XRAY_FOR_LOCAL === "undefined" || process.env.DISABLE_XRAY_FOR_LOCAL === "") {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		AWSXRay.captureAWS(require("aws-sdk"));
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		AWSXRay.captureHTTPsGlobal(require("https"));
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		AWSXRay.captureHTTPsGlobal(require("http"));
	}

	return async (event: APIGatewayProxyEventV2, context: Context) => {
		let body, statusCode;
		/**
		 * initialize debug log for lambda execution
		 */
		const debug = new Debug(event);
		try {
			/**
			 * fire the lambda, if it's OK set HTTP Status Code 
			 */
			body = await lambda(event, context);
			statusCode = 200;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			/**
			 * flush the debug log and set HTTP Status Code = 500 
			 */			
			debug.flush(error);
		
			body = { error: error.message };
			statusCode = 500;
		}

		return {
			statusCode,
			body: JSON.stringify(body),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
				"AT2-Socrates-Message-Information": infoTag(event.requestContext.time)
			},
		};		
	};
}

export default handler;
