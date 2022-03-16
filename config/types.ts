import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";

export type StringUndefined = string | undefined;
/**
 * #### Handler shape for lamda handler function  
 * 
 * @export
 */
export interface IResult {
	[key: string]: unknown
}

export type Handler<TEvent = APIGatewayProxyEventV2, TResult = APIGatewayProxyResultV2 | IResult> = (
    event: TEvent,
    context: Context,
) => Promise<void | TResult>;
