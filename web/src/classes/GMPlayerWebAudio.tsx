import GMPlayer, { IOptions } from "./AbstractGMPlayer";
import { IAudioSupport } from "./GM";
/*

*/
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
			 * support for cross browser compatability - although all browsers now support
			 * the Web Audio API, so it is a legacy fallback just in case
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
		if(lkey === 64) {
			return input.substring(0, input.length - 1);
		}
		return input;
	}

	private decode = (input: any, arrayBuffer: ArrayBuffer) => {
		/**
		 * Remove last characters if they are invalid
		 */
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);
		/**
		 * It takes 4 characters to generate 3 8-bit numbers (octets)
		 */
		const uArraySize = (input.length / 4) * 3;
		
		let uArray;
		if (arrayBuffer) {
			uArray = new Uint8Array(arrayBuffer);
		} else {
			uArray = new Uint8Array(uArraySize);
		}

		/**
		 * clean up any invalid characters in the input string
		 */
		/* eslint-disable-next-line */
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		let octet1, octet2, octet3;
		let encodedCharacter1, encodedCharacter2, encodedCharacter3, encodedCharacter4;
		let characterPosition = 0;
		for (let i = 0; i < uArraySize; i += 3) {	
			/**
			 * Get next four characters positions in the keyString
			 */
			encodedCharacter1 = this._keyString.indexOf(input.charAt(characterPosition++));
			encodedCharacter2 = this._keyString.indexOf(input.charAt(characterPosition++));
			encodedCharacter3 = this._keyString.indexOf(input.charAt(characterPosition++));
			encodedCharacter4 = this._keyString.indexOf(input.charAt(characterPosition++));
			/**
			 * Manipulate the four character positions into 3 8-bit numbers (octets)
			 */
			octet1 = (encodedCharacter1 << 2) | (encodedCharacter2 >> 4);
			octet2 = ((encodedCharacter2 & 15) << 4) | (encodedCharacter3 >> 2);
			octet3 = ((encodedCharacter3 & 3) << 6) | encodedCharacter4;
			/**
			 * Store the octets in the 8-bit unsigned integer array
			 */
			uArray[i] = octet1;			
			if (encodedCharacter3 !== 64) {
				uArray[i+1] = octet2;
			}
			if (encodedCharacter4 !== 64) {
				uArray[i+2] = octet3;
			}
		}

		return uArray;	
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

	public noteOn = (instrumentId: number, note: string, velocity: number, delay: number = 0, duration: number = 1.5): void => {

		delay += this.context.currentTime;

		const bufferId = this.generateAudioBufferId(instrumentId, note);
		if (!this.audioBuffers[bufferId]) {
 			console.error("No Buffer Found for ID =", bufferId);
			return;
		}

		const source = this.context.createBufferSource();
		source.buffer = this.audioBuffers[bufferId];
		source.connect(this.context.destination);
		source.start(delay, 0, duration);
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
			soundFontsLoadedById.push(MIDI.getInstrumentIDbyName(key))
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
							if (options.loadCallback) options.loadCallback();
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
