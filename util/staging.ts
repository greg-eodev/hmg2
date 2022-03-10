import { StringUndefined } from "../config/types";
import { deployment, IDeployment } from "../config/config";
import { v4 as uuidv4 } from "uuid";

/**
 * #### Is Stage valid for prefixing 
 *
 * @param stage                          stage from SST deploy
 * @param stages                         array of valid stage names
 * @returns {*} 						 true if member of valid stages, false otherwise
 */
export const isValidStage = (stage: string, stages: Array<string>): boolean => {
	return stages.indexOf(stage) > -1;
}
/**
 * #### Generate a API prefix for API Gateway Custom Domain
 *
 * @param stage                          stage from SST deploy
 * @param stages                         array of valid stage names
 * @param excludeAppend                  stage name to exclude from being appended to prefix
 * @param [shouldCreatePrefix=true]      should we generate a prefix? convenience setting to override generation of a prefix
 * @returns {*} 						 return a prefix
 *                                        + undefined for no valid prefix
 * 									      + prefix: special handling for prod stage clean prefix api, otherwise api-<stage>
 */
export const getApiPrefix = (stage: string, deployment: IDeployment, shouldCreatePrefix = true): StringUndefined => {
	let prefix;
	if (shouldCreatePrefix && isValidStage(stage, Object.keys(deployment))) {
		stage = deployment[stage].apiMapping;
		prefix = deployment[stage].hasNoSuffix ? "api" : `api-${stage}`;
	}
	return prefix;
}
/**
 * #### Build a Custom Fully Qualified Domain
 *
 * @param deploymentPrefix              prefix of the FQDN
 * @param baseUrl                       base URL of FQDN
 * @returns {*}                         constructed FQDN <prefix>.<base url>
 */
export const getCustomDomain = (deploymentPrefix: StringUndefined, baseUrl: StringUndefined): StringUndefined => {
	if (deploymentPrefix && baseUrl) {
		return deploymentPrefix + '.' + baseUrl;
	}
	return undefined;
}

export const customLambdaName = (name: string, stage: string) => {
	let customName = name;
	if (isValidStage(stage, Object.keys(deployment))) {
		stage = deployment[stage].apiMapping;
		customName = name + "-" + (deployment[stage].hasNoSuffix ? "" : stage);
	} else {
		customName = name + "-" + stage + "-" + uuidv4();
	}
	return customName;
}
