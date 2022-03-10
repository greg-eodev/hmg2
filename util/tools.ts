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
	cdk.Tags.of(stack).add("sz:property", "anywhere-teacher");
	cdk.Tags.of(stack).add("sz:owner", (stage === "prod" ? "operations" : "development"));
	cdk.Tags.of(stack).add("sz:version", process.env.AT2_VERSION ? process.env.AT2_VERSION : "");
	cdk.Tags.of(stack).add("sz:environment", stage);
	props.forEach((prop) => {
		cdk.Tags.of(stack).add(prop.tag, prop.value);
	});
}

export const addMultipleApiDependency = (apiStacks: Array<Stack>): void => {
	if (apiStacks.length > 1) {
		apiStacks[apiStacks.length - 1].addDependency(apiStacks[apiStacks.length - 2]);
	}
}
