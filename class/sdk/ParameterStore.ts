import Sdk from "./Sdk";
import { StringUndefined } from "../../config/types";
import {
	SSMClient,
	GetParameterCommand,
	GetParameterCommandInput, 
	SSMClientConfig
} from "@aws-sdk/client-ssm";
/**
 * #### AWS Systems Manager Parameters
 *
 * | key | Value |  
 * | --- | --- |  
 * | baseUrl | base URL for use throughout the stack |  
 * | deployTrafficFlow | status of Route 53 Traffic Flow deployment |  
 * | hostedZoneId | ID of the Route 53 Hosted Zone associated to the baseUrl |  
 * 
 * @export  
 * @interface ISSMParameters  
 */
export interface ISSMParameters {
	baseUrl?: StringUndefined,
	deployTrafficFlow?: StringUndefined,
	hostedZoneId?: StringUndefined
}
/**
 * #### System Manager Wrapper Class
 *
 * Tools for working with the AWS SDK System Manager module and provide consistent implementation across all
 * service and commands.
 *
 * @class ParameterStore
 */
class ParameterStore extends Sdk {

	constructor (configuration: SSMClientConfig) {
		super(new SSMClient(configuration));
	}
	/**
	 * #### Execute the Get Parameter Command
	 * 
	 * check for mismtached paramters and return only the response value if no errors
	 *
	 * @param parameter                       name of the parameter
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of the value of the requested parameter
	 */
	public async getParameter(parameter: string, verbose = false) : Promise<StringUndefined> {
		const parameterInput: GetParameterCommandInput = {
			"Name": parameter
		}

		const parameterData = await this.processCommand(
			GetParameterCommand,
			parameterInput,
			"Parameter Store: [" + parameter + "] Error: Parameter Not Found.",
			verbose
		);
		if (parameterData) {
			if (!(parameterData.Parameter && parameterData.Parameter.Name === parameter)) {
				throw new Error("Parameter Store: Mismatched parameter: source = " + parameter + " and return = " + (parameterData.Parameter && parameterData.Parameter.Name ? parameterData.Parameter.Name : "No Name Returned"));
			}
			if (verbose) console.log("Parameter Store: [" + parameter + "]", parameterData);
			return parameterData.Parameter.Value;
		}
		return undefined;
	}
}

export default ParameterStore;
