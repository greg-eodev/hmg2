/**
 * #### AWS SDK Base
 * 
 * Tools for working with the AWS SDK and provide common implementations for
 * AWS SDK Module wrapper classes
 *
 * @class Sdk
 */
class Sdk {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public client: any;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor (client: any) {
		this.client = client;
	}

	/**
	 * #### Process an AWS SDK Command
	 * 
	 * Implements the standard calling pattern for AWS SDK modules
	 * + instantiate the AWS SDK module client (passed in constructor)
	 * + instantiate the AWS SDK command
	 * + transmit the command object to the client asynchronously
	 * + process the response
	 *
	 * @param command                       AWS SDK command creation function
	 * @param parameters                    parameters for command creation, specific to each call
	 * @param errorMessage                  customized Error message for each call
	 * @param verbose                       true: output additional console logs and error information
	 * @returns                             command response, if error returns undefined
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public processCommand = async (command: any, parameters: unknown, errorMessage: string, verbose: boolean ) => {
		const cmd = new command(parameters);

		try {
			const response = await this.client.send(cmd);
			if (verbose) console.log("Response:", response);
			return response;
		} catch (error) {
			console.error(errorMessage);
			if (verbose) console.error(error);
			return undefined;
		}
	}
}

export default Sdk;
