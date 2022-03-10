import { StringUndefined } from "../config/types"
import { Stack } from "@serverless-stack/resources";
import * as cdk from "aws-cdk-lib";
/**
 * #### Format a AWS Region string
 *
 * @param region                   AWS Region identifier string
 * @returns                        Region string (default string if no region found)
 */
export const formatRegion = (region: StringUndefined): string => {
	return typeof region === "undefined" ? "No Region Found" : region;
}

/**
 * #### Generate Information Tag
 *
 * @param time 					time stamp for the tag
 * @returns 					returns a standard Information Tag or empty string
 */
export const infoTag = (time: string): string => {
	return `[at2-${formatRegion(process.env.AWS_REGION)}-${time}]`
}
/**
 * ***************************************************************************************************
 */
export interface ITagPropsMember {
	tag: string,
	value: string
}

export type ITagProps = Array<ITagPropsMember>;
	
export const addAwsTags = (stack: Stack, stage: string, props: ITagProps ): void => {
	console.log("env", JSON.stringify(process.env));
	cdk.Tags.of(stack).add("hmg:version", process.env.HMG_VERSION ? process.env.HMG_VERSION : "");
	cdk.Tags.of(stack).add("hmg:environment", stage);
	console.log('props', JSON.stringify(props))
	props.forEach((prop) => {
		console.log('prop', JSON.stringify(prop))
		cdk.Tags.of(stack).add(prop.tag, prop.value);
	});
}

export const addMultipleApiDependency = (apiStacks: Array<Stack>): void => {
	if (apiStacks.length > 1) {
		apiStacks[apiStacks.length - 1].addDependency(apiStacks[apiStacks.length - 2]);
	}
}
