abstract class AbstractDebug {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {
	}

	/**
	 * #### Initialze Logging Session
	 *
	 * @param event 				event object of whatever shape is appropriate for derived class
	 */
	abstract init(event: unknown): void;

	/**
	 * #### Add Debug Entry to the Log
	 *
	 * @param params 				variable number of parameters that represent the entry
	 */
	abstract debug(...params: unknown[]): void;

	/**
	 * #### Flush Error Log 
	 *
	 * @param error 				error object
	 */
	abstract flush(error: unknown): void;
}

export default AbstractDebug;
