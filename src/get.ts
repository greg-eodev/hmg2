import { APIGatewayProxyResultV2 } from "aws-lambda";
import handler from "../util/handler";

export const main = handler(
	async (): Promise<APIGatewayProxyResultV2> => {
		return (
			`Welcome to the Harmonagon API! Please visit http://harmonagon.com/ to find out more.`
		);
	}
);
