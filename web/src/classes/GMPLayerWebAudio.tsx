import GMPlayer, { IOptions } from "./AbstractGMPlayer";
import { IAudioSupport } from "./GM";

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		webkitAudioContext: any;
		MIDI: any;
	}
}

interface IAudioBuffer {
	[index: string]: any;
}

class GMPlayerWebAudio extends GMPlayer {
	private _audioSupport: IAudioSupport;
	private _keyString: string;
	public audioBuffers: IAudioBuffer;
	public context: any;

	constructor (audioSupport: IAudioSupport) {
		super();
		
		this._keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		this._audioSupport = audioSupport;
		this.audioBuffers = {};
		if (this._audioSupport.webAudio) {
			/**
			 * support for cross browser compatability - although all browsers support API 
			 * so it is a legacy fallback just in case
			 */
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();
		}
	}

	/**
	 * Copyright 2011, Daniel Guerrero. All rights reserved.
	 */
	public decodeArrayBuffer = (input: any): ArrayBuffer => {
		const bytes = (input.length / 4) * 3;
		const ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
	
		return ab;
	}

	private removePaddingChars = (input: any) => {
		const lkey = this._keyString.indexOf(input.charAt(input.length - 1));
		if(lkey === 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	}

	private decode = (input: any, arrayBuffer: ArrayBuffer) => {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		const bytes = (input.length / 4) * 3;
		
		let uarray;
		let chr1, chr2, chr3;
		let enc1, enc2, enc3, enc4;
		let i = 0;
		let j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		/* eslint-disable-next-line */
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyString.indexOf(input.charAt(j++));
			enc2 = this._keyString.indexOf(input.charAt(j++));
			enc3 = this._keyString.indexOf(input.charAt(j++));
			enc4 = this._keyString.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 !== 64) uarray[i+1] = chr2;
			if (enc4 !== 64) uarray[i+2] = chr3;
		}

		return uarray;	
	}
	/**
	 * END: Copyright 2011, Daniel Guerrero. All rights reserved.
	 */

	public generateAudioBufferId = (instrumentId: number, note: string) => {
		return instrumentId.toString() + note;
	}

	public send = (data: any, delay: number): void => { };
	public setController = (channelId: number, type: string, value: number, delay: number): void => { };
	public setVolume = (channelId: number, volume: number, delay: number): void => { };
	public programChange = (channelId: number, program: number, delay: number): void => { };
	public pitchBend = (channelId: number, program: number, delay: number): void => { };

	public noteOn = (channelId: number, noteId: string, velocity: number, delay?: number): void => {
		const MIDI = window.MIDI;

		console.log("NoteOn: Entry", channelId, noteId, velocity, delay);

		delay = delay || 0;
		/**
		 * TODO: support instrument selection for multi-voice channels
		 */
		var instrument = 0;
		var bufferId = this.generateAudioBufferId(instrument, noteId);
		var buffer = this.audioBuffers[bufferId];
		if (!buffer) {
 			console.log("No buffer Found", bufferId, instrument, channelId);
			return;
		}
		console.log("Buffer found",  buffer);

		const source = this.context.createBufferSource();
		source.buffer = buffer;
		source.connect(this.context.destination);
		source.start(delay);
	 };

	public noteOff = (channelId: number, noteId: string, delay: number): void => { };
	public chordOn = (channelId: number, chord: string, velocity: number, delay: number): void => { };
	public chordOff = (channelId: number, chord: string, delay: number): void => { };
	public stopAllNotes = (): void => { };

	public connect = (options: IOptions): void => {
		const MIDI = window.MIDI; 
		/**
		 * load the specified soundFonts into the context for this channel
		 */
		const soundFontsLoadedById: Array<number> = [];
		options.soundFonts.forEach((key) => {
			soundFontsLoadedById.push(window.MIDI.getInstrumentIDbyName(key))
		});

		let activeSoundFontBase64;
		let decodedArrrayBufferUInt8;
		options.soundFonts.forEach((key, loadedIndex) => {
			if (MIDI.Soundfont[key]) {
				Object.keys(MIDI.Soundfont[key]).forEach((note) => {
					const bufferId = this.generateAudioBufferId(soundFontsLoadedById[loadedIndex], note);
					activeSoundFontBase64 = MIDI.Soundfont[key][note].split(',')[1];
					decodedArrrayBufferUInt8 = this.decodeArrayBuffer(activeSoundFontBase64);

					this.context.decodeAudioData(
						decodedArrrayBufferUInt8,
						(buffer: any) => {
							buffer.id = bufferId;
							this.audioBuffers[bufferId] = buffer;
						}, 
						(error: Error) => {
							console.error("Sound Font Decoded Error for Sound ID =", bufferId, error);
						}
					);
				})
			}
		})
	};
}

export default GMPlayerWebAudio;
