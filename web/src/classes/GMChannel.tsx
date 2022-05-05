/**
 * TODO: Determine where to support delay functionality but it should not be here
 */
class GMChannel {
	private _channelId: number;
	private _instrument: number;
	private _pitchBend: number;
	private _mute: boolean;
	private _mono: boolean;
	private _omni: boolean;
	private _solo: boolean;

	constructor (channelId: number) {
		this._channelId = channelId;
		this._instrument = channelId;
		this._pitchBend = 0;
		this._mute = false;
		this._mono = false;
		this._omni = false;
		this._solo = false;
	}

	// #region : Getters and Setters
	public get channelId () {
		return this._channelId;
	}

	public get instrument () {
		return this._instrument;
	}

	public set instrument (programId: number) {
		this._instrument = programId;
	}

	public get pitchBend () {
		return this._pitchBend;
	}

	public set pitchBend (value: number) {
		this._pitchBend = value;
	}

	public get mute () {
		return this._mute;
	}

	public set mute (value: boolean) {
		this._mute = value;
	}

	public get mono () {
		return this._mono;
	}

	public set mono (value: boolean) {
		this._mono = value;
	}

	public get omni () {
		return this._omni;
	}

	public set omni (value: boolean) {
		this._omni = value;
	}

	public get solo () {
		return this._solo;
	}

	public set solo (value: boolean) {
		this._solo = value;
	}
	// #endregion
}

export default GMChannel;
