/**
 * #### Deployment Object Member
 *
 * A deployment member represents the organization of deployment stages and name transforms  
 * 
 * | key | Value |  
 * | --- | --- |  
 * | stage | the stage name of the current deployment |  
 * | ApiMapping | the stage name attached to the API custom domain name |  
 * | hasNoSuffix | **true** if not attaching stage name as suffix to API custom domain name, **false** otherwise |  
 * | deploymentSet | an array of stages that are deployed together unified in Route 53 Traffic Policy |  
 * | local | is the stage local deployment? |  
 * 
 * @export  
 * @interface IDeploymentMember  
 */
 export interface IDeploymentMember {
	stage: string,
	region: string,
	apiMapping: string,
	hasNoSuffix: boolean,
	deploymentSet: Array<string>,
	local: boolean
}
/**
 * #### Deployment Object Interface  
 * 
 * A deployment object containing one IDeploymentMember per stage [key: stage]  
 *
 * @export  
 * @interface IDeployment  
 */
export interface IDeployment {
	[key: string]: IDeploymentMember
}
/**
 * #### Deployment Object  
 * 
 * Describes the SST/SEED deployment architecture
 * @IDeploymentMember               see for details
 */
export const deployment: IDeployment = {
	"prod": {
		stage: "prod",
		region: "us-east-1",
		apiMapping: "prod",
		hasNoSuffix: true,
		deploymentSet: ["prod", "prod-w"],
		local: false
	},
	"dev": {
		stage: "dev",
		region: "us-east-1",
		apiMapping: "dev",
		hasNoSuffix: false,
		deploymentSet: ["dev", "dev-w"],
		local: false
	},
	"gregh": {
		stage: "gregh",
		region: "us-east-1",
		apiMapping: "gregh",
		hasNoSuffix: false,
		deploymentSet: ["gregh"],
		local: true
	}
}

export const deploymentAuthenticationStageMaster: Array<string> = ["prod", "dev", "gregh"];
