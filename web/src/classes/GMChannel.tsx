import { IAudioSupport } from "./GM";
import GMPlayer from "./AbstractGMPlayer";
import GMPlayerWebAudio from "./GMPlayerWebAudio";

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
	public player: GMPlayer;

	constructor (channelId: number, audioSupport: IAudioSupport) {
		this._channelId = channelId;
		this._instrument = channelId;
		this._pitchBend = 0;
		this._mute = false;
		this._mono = false;
		this._omni = false;
		this._solo = false;
		/**
		* TODO: this will determine the hierarchary for which audio library to use
		*/
		if (audioSupport.webAudio) {
			this.player = new GMPlayerWebAudio(audioSupport);
		} else {
			this.player = Object.create(null);
		}
	}

	// #region : Getters and Setters
	public get channelId (): number {
		return this._channelId;
	}

	public get instrument (): number {
		return this._instrument;
	}

	public set instrument (instrumentId: number) {
		this._instrument = instrumentId;
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
