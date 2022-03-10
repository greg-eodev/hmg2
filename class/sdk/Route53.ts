import Sdk from "./Sdk";
import { StringUndefined } from "../../config/types";
import { 
	Route53Client,
	GetTrafficPolicyCommand,
	ListTrafficPoliciesCommand,
	ListTrafficPoliciesCommandInput,
	CreateTrafficPolicyCommand,
	CreateTrafficPolicyInstanceCommand,
} from "@aws-sdk/client-route-53";
/**
 * #### Route 53 Parameters
 *
 * | key | Value |  
 * | --- | --- |  
 * | Id | the traffice policy ID |  
 * | Version | the version of the traffic policy |  
 * 
 * @export  
 * @interface ITrafficPolicyParameters
 */
export interface ITrafficPolicyParameters {
	Id: string,
	Version: number
}
/**
 * #### Create Traffic Policy Parameters
 * 
 * | key | Value |  
 * | --- | --- |  
 * | Name | the traffic policy Name |  
 * | Document | the traffic policy document |  
 * | Comment | note/comment for the traffic policy |  
 *
 * @export
 * @interface ICreateTrafficPolicyParameters
 */
export interface ICreateTrafficPolicyParameters {
	Name: string,
	Document: StringUndefined,
	Comment: string
}
/**
 * #### Create Traffic Policy Instance Parameters
 * 
 * | key | Value |  
 * | --- | --- |  
 * | HostedZoneId | Route 53 hsoted zone |  
 * | Name | domain name for the traffic policy instance |  
 * | TrafficPolicyId | ID from the traffic policy |  
 * | TrafficPolicyVersion | version for the traffic policy represented with ID |  
 * | TTL | Time To Live |  
 *
 * @export
 * @interface ICreateTrafficPolicyInstanceParameters
 */
export interface ICreateTrafficPolicyInstanceParameters {
	HostedZoneId: StringUndefined,
	Name: StringUndefined,
	TrafficPolicyId: StringUndefined,
	TrafficPolicyVersion: number | undefined,
	TTL: number | undefined
}
/**
 * #### Route 53 Wrapper Class
 *
 * Tools for working with the AWS SDK Route 53 module and provide consistent implementation across all
 * service and commands.
 * 
 * @export
 * @class Route53
 */
export class Route53 extends Sdk {

	constructor () {
		super(new Route53Client({}));
	}
	/**
	 * #### Execute the Create Traffic Policy Command
	 *
	 * @param parameters                      parameters for the command
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of response
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async createTrafficPolicy(parameters: ICreateTrafficPolicyParameters, verbose = false): Promise<any | undefined> {
		return await this.processCommand(
			CreateTrafficPolicyCommand,
			parameters,
			"Route 53: Create Traffic Policy failed.",
			verbose
		);
	}
	/**
	 * #### Execute the Create Traffic Policy Instance Command
	 *
	 * @param parameters                      parameters for the command
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of response
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async createTrafficPolicyInstance(parameters: ICreateTrafficPolicyInstanceParameters, verbose = false): Promise<any | undefined> {
		return await this.processCommand(
			CreateTrafficPolicyInstanceCommand,
			parameters, 
			"Route 53: Create Traffic Policy Instance failed.",
			verbose
		);
	}
	/**
	 * #### Execute the Get Traffic Policy List Command
	 *
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of response
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getTrafficPolicyList(verbose = false): Promise<any | undefined> {
		const parameterInput: ListTrafficPoliciesCommandInput = {
			MaxItems: undefined,
			TrafficPolicyIdMarker: undefined
		};
		return await this.processCommand(
			ListTrafficPoliciesCommand,
			parameterInput,
			"Route 53: Get Traffic Policy List failed.",
			verbose
		);
	}
	/**
	 * #### Execute the Get Traffic Policy Command
	 *
	 * @param parameters                      parameters for the command
	 * @param [verbose=false]                 true: output additional console logs and error information
	 * @returns                               promise of response
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getTrafficPolicy(parameters: ITrafficPolicyParameters, verbose = false): Promise<any | undefined> {
		return await this.processCommand(
			GetTrafficPolicyCommand,
			parameters,
			"Route 53: Get Traffic Policy failed.",
			verbose
		);
	}
}

export default Route53;
