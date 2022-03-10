import AWSXRay from "aws-xray-sdk";
/**
 * #### Trace: XRay Subsegment Trace Wrapper for Lambda Functions  
 *   
 * The XRay Class provides a consistent wrapper for adding AWS XRay named subsegment traces for
 * use throughout AWS Lmabda function code.  XRay provides both asynchronous (asyncFunc) and synchronous (syncFunc)
 * methods that accept a function and an unbounded number of function parameters leveraging Typescript's
 * Rest Parameters and Arguments (see: https://www.typescriptlang.org/ for more info).
 *   
 * The implementation follows:  
 * 
 * ```javascript
 * const newSegment = new Xray("New-Segment-Name");
 * await newSegment.asyncFunc(
 *     (paramA, paramB ... paramZZZ) => {
 *         *** code ***
 *         return response;
 *     }, paramA, paramB, ... paramZZZ
 * )
 * ```  
 * 
 * The addAnnotation and addMetadata methods should be used inside the function passed to asyncFunc or syncFunc, for example:
 * 
 * ```javascript
 * const newSegment = new Xray("New-Segment-Name");
 * await newSegment.asyncFunc(
 *     (paramA, paramB ... paramZZZ) => {
 *         *** code ***
 *         newSegment.addAnnotation("someKey", true);
 *         *** code ***
 *         newSegment.addMetadata("paramA", paramA);
 *         *** code ***
 *         return response;
 *     }, paramA, paramB, ... paramZZZ
 * )
 * ```   
 * 
 * **NOTES**:
 * + **asyncFunc** and **syncFunc** can be called multiple times, but it will log separate trace entries with the same name, 
 * consider if inside a loop creating new XRay objects per iteration, for example Segment-Name-1, Segment-Name-2, ... Segment-Name-3
 * or something more expressive
 * + XRay objects can be nested inside other XRay objects
 * + AWS XRay limits the number of annotations to 50, there may or may not be a limit on metadata entries
 * 
 * @export  
 * @class Trace  
 */
class Trace {
	private subsegmentName: string;
	private isNotLocalDevelopment: boolean;

	/**
	 * #### Creates an instance of XRay.  
	 * 
	 * @param subsegmentName                 name for the subsegment
	 * @param isNotLocalDevelopment          true: implement AWS XRay | false: impede XRay for SST local development
	 */
	constructor (subsegmentName: string) {
		this.subsegmentName = subsegmentName;
		this.isNotLocalDevelopment = typeof process.env.DISABLE_XRAY_FOR_LOCAL === "undefined" || process.env.DISABLE_XRAY_FOR_LOCAL === "";
	}

	/**
	 * #### Process the Asynchronous Function
	 *
	 * @param fn                            async function
	 * @param parameters                    REST parameters (variable number and type)
	 * @param [subsegment]                  optional subsegment if instrumented for XRay
	 * @returns                             response package
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	private processAsyncFunction = async (fn: Function, parameters: unknown[], subsegment?: AWSXRay.Subsegment | undefined) => {
		let response;
		try {
			response = await fn(...parameters);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			response = { error: error.message };
		} finally {
			/**
			 * if an XRay subsegment exists make sure it's closed
			 */	
			if (subsegment && !subsegment.isClosed()) {
				subsegment.close();
			}
		}	

		return response;
	}

	/**
	 * #### Process the Synchronous Function
	 *
	 * @param fn                            function
	 * @param parameters                    REST parameters (variable number and type)
	 * @param [subsegment]                  optional subsegment if instrumented for XRay
	 * @returns                             response package
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	private processSyncFunction = (fn: Function, parameters: unknown[], subsegment?: AWSXRay.Subsegment | undefined) => {
		let response;
		try {
			response = fn(...parameters);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			response = { error: error.message };
		} finally {
			/**
			 * if an XRay subsegment exists make sure it's closed
			 */	
			if (subsegment && !subsegment.isClosed()) {
				subsegment.close();
			}
		}	

		return response;
	}

	/**
	 * #### Asynchronous XRay Capture Wrapper
	 *
	 * @param fn                            function
	 * @param parameters                    REST parameters (variable number and type)
	 * @returns                             promise
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public asyncFunc = async (fn: Function, ...parameters: unknown[]): Promise<unknown> => {
		if (this.isNotLocalDevelopment) {
			return await AWSXRay.captureAsyncFunc(this.subsegmentName, 
				async (subsegment) => {
					console.log(subsegment);
					return await this.processAsyncFunction(fn, parameters, subsegment);
				}, AWSXRay.getSegment()
			);
		} else {
			return await this.processAsyncFunction(fn, parameters);
		}
	}

	/**
	 * #### Synchronous XRay Capture Wrapper
	 *
	 * @param fn                            function
	 * @param parameters                    REST parameters (variable number and type)
	 * @returns                             response
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public syncFunc = (fn: Function, ...parameters: unknown[]): unknown => {
		if (this.isNotLocalDevelopment) {
			return AWSXRay.captureFunc(this.subsegmentName, 
				(subsegment) => {
					return this.processSyncFunction(fn, parameters, subsegment);
				}, AWSXRay.getSegment()
			);
		} else {
			return this.processSyncFunction(fn, parameters);
		}
	}

	/**
	 * #### Add an Annotation to the subsegment
	 * 
	 * Accepts a key/value pair that becomes indexed for filtering within the trace console
	 *
	 * @param key                         key: up to 500 alphanumeric characters. No spaces or symbols except underscores.
	 * @param value                       string, number, or boolean: Up to 1,000 Unicode characters.
	 */
	public addAnnotation = (key: string, value: string | number | boolean): void => {
		if (this.isNotLocalDevelopment) {
			AWSXRay.getSegment()?.addAnnotation(key, value);
		}
	}

	/**
	 * #### Add Metadata to the subsegment
	 * 
	 * Accepts a key/value pair that becomes accessible from the subsegment, not indexed for filtering,
	 * and used to record additional data that is stored in the trace but not needed for filtering.
	 *
	 * @param key                         key: up to 500 alphanumeric characters. No spaces or symbols except underscores.
	 * @param value                       value can be any type including objects that can be serialized into a JSON object or array
	 */
	public addMetadata = (key: string, value: unknown): void => {
		if (this.isNotLocalDevelopment) {
			AWSXRay.getSegment()?.addMetadata(key, value)
		}
	}
}

export default Trace;
