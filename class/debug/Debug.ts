import AbstractDebug from "./AbstractDebug";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import AWSDebug from "./AWSDebug";

class Debug extends AbstractDebug {
	private debugger: AbstractDebug;

	constructor(event: APIGatewayProxyEventV2) {
		super();

		this.debugger = new AWSDebug(event);
	}

	/**
	 * #### Initialze Logging Session
	 *
	 * @param event 				
	 */
	public init(event: APIGatewayProxyEventV2) {
		this.debugger.init(event);
	}

	/**
	 * #### Add Debug Entry to the Log
	 *
	 * @param params 				variable number of parameters that represent the entry
	 */
	public debug(...params: unknown[]) {
		this.debugger.debug(params);
	}

	/**
	 * #### Flush the Error Log
	 *
	 * @param error 				error object
	 */
	public flush(error: unknown): void {
		this.debugger.flush(error);
	}	
}

export default Debug;
