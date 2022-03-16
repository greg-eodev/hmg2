import Sdk from "./Sdk";
import { StringUndefined } from "../../config/types";
import {
	ApiGatewayV2Client, 
	ApiGatewayV2ClientConfig, 
	GetDomainNameCommand,
	GetDomainNameCommandInput,
} from "@aws-sdk/client-apigatewayv2";
/**
 * #### Api Gateway Parameters
 *
 * | key | Value |  
 * | --- | --- |  
 * | domainName | the API Gateway custom domain name |  
 * | stage | deployment stage name |  
 * 
 * @export  
 * @interface IApiGWParameters  
 */
export interface IApiGWParameters {
	domainName: StringUndefined,
	stage: string
}
/**
 * #### API Gateway Wrapper Class
 *
 * Tools for working with the AWS SDK API Gateway module and provide consistent implementation across all
 * service and commands.
 *
 * @class ApiGateway
 */
class ApiGateway extends Sdk {

	constructor (configuration: ApiGatewayV2ClientConfig) {
		super(new ApiGatewayV2Client(configuration));
	}
	/**
	 * #### Execute the Get Domain Name
	 * 
	 * check for mismtached paramters and return only the response value if no errors
	 *
	 * @param parameter                       fully qualified domain name to get the DomainName object
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of the api URL associated to the requested parameter
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getDomainName(parameter: string, verbose = false) : Promise<any> {
		const parameterInput: GetDomainNameCommandInput = {
			DomainName: parameter
		}
		const apiResponseData = await this.processCommand(
			GetDomainNameCommand,
			parameterInput, 
			"API Gateway: [" + parameter + "] Error: Parameter Not Found.",
			verbose
		);

		if (apiResponseData) {
			if (verbose) console.log(apiResponseData);
			return apiResponseData.DomainNameConfigurations
				? apiResponseData.DomainNameConfigurations[0].ApiGatewayDomainName
				: undefined;
		}
		return undefined;
	}
}

export default ApiGateway;
