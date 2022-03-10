import util from "util";
import AWS from "aws-sdk";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import AbstractDebug from "./AbstractDebug";

class AWSDebug extends AbstractDebug {
	logs: Array<Record<string, unknown>>;
	// Log AWS SDK calls

	constructor(event: APIGatewayProxyEventV2) {
		super();

		AWS.config.logger = { log: this.debug };
		this.logs = [];
		this.init(event);
	}

	/**
	 * #### Initialze Logging Session
	 *
	 * @param event 				
	 */
	public init(event: APIGatewayProxyEventV2) {
		// Log API event
		this.debug("API event", {
			body: event.body,
			pathParameters: event.pathParameters,
			queryStringParameters: event.queryStringParameters,
		});
	}

	/**
	 * #### Add Debug Entry to the Log
	 *
	 * @param params 				variable number of parameters that represent the entry
	 */
	public debug(...params: unknown[]) {
		this.logs.push({
			date: new Date(),
			entry: util.format.apply(null, params),
		});
	}

	/**
	 * #### Flush the Error Log to CloudWatch
	 * + itterate over the log and output all messages as console.debug
	 * + close the flush with an console.error
	 *
	 * @param error 				error object
	 */
	public flush(error: unknown): void {
		this.logs.forEach(({ date, entry }) => {
			console.debug(date, entry)
		});
		console.error(error);
	}
}

export default AWSDebug;
