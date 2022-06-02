/**
 * #### MidiTS - Modern Midi for the Modern Browser
 * + Built with Typescript
 * 
 * Derived from the hardwork of others and the MidiJS library (https://galactic.ink/midi-js/) and
 * https://github.com/mudcube/MIDI.js/ - thanks MudCube!
 * 
 * TODO: make t.ds file for GM
 */
import GMChannel from "./GMChannel";

interface IMidiInstrument {
	id: string;
	instrument: string;
	number: number;
	category: string;
}

interface IMidiById {
	[index: number]: IMidiInstrument;
}

interface IMidiByName {
	[index: string]: IMidiInstrument;
}

interface IMidiByCategory {
	[index: string]: IMidiByName;
}

type InstrumentList = Array<string>;
interface IInstruments {
	[index: string]: InstrumentList;
}

interface IKeyToNote {
	[index: string]: number;
}

interface INoteToKey {
	[index: number]: string;
}

interface IChannels {
	[index: number]: GMChannel;
}

export interface IAudioSupport {
	webMIDI: boolean;
	webAudio: boolean;
	audioTag: boolean;
	vorbis: string;
	mpeg: string;
}

class GM {
	private _byId: IMidiById;
	private _byName: IMidiByName;
	private _byCategory: IMidiByCategory;
	private _keyToNote: IKeyToNote;
	private _noteToKey: INoteToKey;
	private _channels: IChannels;
	private _instruments: IInstruments;
	private _audioSupport: IAudioSupport;
	private _numberOfChannels: number;

	constructor (numberOfChannels = 1) {
		const MAX_CHANNELS = 16;
		this._numberOfChannels = numberOfChannels <= 0 ? 1 : numberOfChannels;
		this._numberOfChannels = this._numberOfChannels > MAX_CHANNELS ? MAX_CHANNELS : this._numberOfChannels;

		this._instruments = {
			"Piano": ["1 Acoustic Grand Piano", "2 Bright Acoustic Piano", "3 Electric Grand Piano", "4 Honky-tonk Piano", "5 Electric Piano 1", "6 Electric Piano 2", "7 Harpsichord", "8 Clavinet"],
			"Chromatic Percussion": ["9 Celesta", "10 Glockenspiel", "11 Music Box", "12 Vibraphone", "13 Marimba", "14 Xylophone", "15 Tubular Bells", "16 Dulcimer"],
			"Organ": ["17 Drawbar Organ", "18 Percussive Organ", "19 Rock Organ", "20 Church Organ", "21 Reed Organ", "22 Accordion", "23 Harmonica", "24 Tango Accordion"],
			"Guitar": ["25 Acoustic Guitar (nylon)", "26 Acoustic Guitar (steel)", "27 Electric Guitar (jazz)", "28 Electric Guitar (clean)", "29 Electric Guitar (muted)", "30 Overdriven Guitar", "31 Distortion Guitar", "32 Guitar Harmonics"],
			"Bass": ["33 Acoustic Bass", "34 Electric Bass (finger)", "35 Electric Bass (pick)", "36 Fretless Bass", "37 Slap Bass 1", "38 Slap Bass 2", "39 Synth Bass 1", "40 Synth Bass 2"],
			"Strings": ["41 Violin", "42 Viola", "43 Cello", "44 Contrabass", "45 Tremolo Strings", "46 Pizzicato Strings", "47 Orchestral Harp", "48 Timpani"],
			"Ensemble": ["49 String Ensemble 1", "50 String Ensemble 2", "51 Synth Strings 1", "52 Synth Strings 2", "53 Choir Aahs", "54 Voice Oohs", "55 Synth Choir", "56 Orchestra Hit"],
			"Brass": ["57 Trumpet", "58 Trombone", "59 Tuba", "60 Muted Trumpet", "61 French Horn", "62 Brass Section", "63 Synth Brass 1", "64 Synth Brass 2"],
			"Reed": ["65 Soprano Sax", "66 Alto Sax", "67 Tenor Sax", "68 Baritone Sax", "69 Oboe", "70 English Horn", "71 Bassoon", "72 Clarinet"],
			"Pipe": ["73 Piccolo", "74 Flute", "75 Recorder", "76 Pan Flute", "77 Blown Bottle", "78 Shakuhachi", "79 Whistle", "80 Ocarina"],
			"Synth Lead": ["81 Lead 1 (square)", "82 Lead 2 (sawtooth)", "83 Lead 3 (calliope)", "84 Lead 4 (chiff)", "85 Lead 5 (charang)", "86 Lead 6 (voice)", "87 Lead 7 (fifths)", "88 Lead 8 (bass + lead)"],
			"Synth Pad": ["89 Pad 1 (new age)", "90 Pad 2 (warm)", "91 Pad 3 (polysynth)", "92 Pad 4 (choir)", "93 Pad 5 (bowed)", "94 Pad 6 (metallic)", "95 Pad 7 (halo)", "96 Pad 8 (sweep)"],
			"Synth Effects": ["97 FX 1 (rain)", "98 FX 2 (soundtrack)", "99 FX 3 (crystal)", "100 FX 4 (atmosphere)", "101 FX 5 (brightness)", "102 FX 6 (goblins)", "103 FX 7 (echoes)", "104 FX 8 (sci-fi)"],
			"Ethnic": ["105 Sitar", "106 Banjo", "107 Shamisen", "108 Koto", "109 Kalimba", "110 Bagpipe", "111 Fiddle", "112 Shanai"],
			"Percussive": ["113 Tinkle Bell", "114 Agogo", "115 Steel Drums", "116 Woodblock", "117 Taiko Drum", "118 Melodic Tom", "119 Synth Drum"],
			"Sound effects": ["120 Reverse Cymbal", "121 Guitar Fret Noise", "122 Breath Noise", "123 Seashore", "124 Bird Tweet", "125 Telephone Ring", "126 Helicopter", "127 Applause", "128 Gunshot"]
		}

		this._audioSupport = {
			webMIDI: false,
			webAudio: false,
			audioTag: false,
			vorbis: "",
			mpeg: ""		
		}
		this.detectAudioSupport();

		this._byId = {};
		this._byName = {};
		this._byCategory = {};
		this.initMidiInstrumentLists();

		this._keyToNote = {}; // C8  == 108
		this._noteToKey = {}; // 108 ==  C8
		this.initNoteMapping();

		this._channels = {};
		this.initChannels();
	}

	// #region : Getters and Setters
	public get byId (): IMidiById {
		return this._byId
	}

	public get byName (): IMidiByName {
		return this._byName
	}

	public get byCategory (): IMidiByCategory {
		return this._byCategory
	}
	
	public get keyToNote (): IKeyToNote {
		return this._keyToNote
	}
	
	public get noteToKey (): INoteToKey {
		return this._noteToKey
	}
	
	public get channels (): IChannels {
		return this._channels
	}
	// #endregion

	private clean = (name: string): string => {
		return name.replace(/[^a-z0-9 ]/gi, "").replace(/[ ]/g, "_").toLowerCase();
	}

	private initMidiInstrumentLists = (): void => {
		let instrument: string;
		let instrumentNumber: number;
		for (let listKey in this._instruments) {
			let list: InstrumentList = this._instruments[listKey];
			for (let listEntry = 0; listEntry < list.length; listEntry++) {
				instrument = list[listEntry];
				if (!instrument) continue;
				instrumentNumber = parseInt(instrument.substr(0, instrument.indexOf(" ")), 10);
				instrument = instrument.replace(instrumentNumber + " ", "");
				if (!this._byCategory[this.clean(listKey)]) {
                    this._byCategory[this.clean(listKey)] = {};
                }
				this._byId[--instrumentNumber] = 
				this._byName[this.clean(instrument)] = 
				this._byCategory[this.clean(listKey)][this.clean(instrument)] = {
					id: this.clean(instrument),
					instrument: instrument,
					number: instrumentNumber,
					category: listKey
				};
			}
		}
	}

	private initNoteMapping = (): void => {
		const A0 = 0x15; // first note
		const C8 = 0x6C; // last note
		let octave: number;
		let name: string;
		const number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
		for (var note = A0; note <= C8; note++) {
			octave = (note - 12) / 12 >> 0;
			name = number2key[note % 12] + octave;
			this._keyToNote[name] = note;
			this._noteToKey[note] = name;
		}		
	}

	private initChannels = (): void => {
		for (let channelId = 0; channelId < this._numberOfChannels; channelId++) {
			this._channels[channelId] = new GMChannel(channelId, this._audioSupport);
		}
	}

	addChannel = (channelId: number): boolean => {
		if (!this._channels[channelId]) {
			this._channels[channelId] = new GMChannel(channelId, this._audioSupport);
			return true;
		}
		return false;
	}

	private detectAudioSupport = (): void => {
		/**
		 * Detect if Web Audio API is natively supported
		 * + this will be our primary support for audio playback in web browsers
		 * + all major/modern browser support natively - https://caniuse.com/?search=Web%20Audio%20API
		 * 
		 * NOTE: used to use window.webkitAudioContext in check but that should be long deprecated from 
		 * modern browsers in favor of AudioContext - see original audioDetect.js for reference if necessary
		 */
		if (window.AudioContext) {
			this._audioSupport.webAudio = true;
		}
		/**
		 * Detect if Web MIDI API is natively supported
		 * + still unsupported by Safari and Firefox for security concerns
		 */
		if (navigator.requestMIDIAccess) {
			this._audioSupport.webMIDI = (Function.prototype.toString.call(navigator.requestMIDIAccess).indexOf("[native code]") > -1);
		}
		/**
		 * Confirm <audio> tag is supported - if you"re using a browser that doesn"t have the HTML <audio> tag WTF?
		 * But we will check just in case - although we should never have to use it and wont actually write code to 
		 * use it - so yeah there is that.
		 */
		if (typeof Audio !== "undefined") {
			this._audioSupport.audioTag = true;

			const audio = new Audio();
			if (typeof audio.canPlayType !== "undefined") {
				this._audioSupport.vorbis = audio.canPlayType("audio/ogg; codecs=\"vorbis\"");
				this._audioSupport.mpeg = audio.canPlayType("audio/mpeg");
			}
		}
	}

	getAudioSupport = (): IAudioSupport => {
		return this._audioSupport;
	}

	getInstrumentIdByName = (instrumentName: string): number => {
		return this._byName[instrumentName].number
	}
}

export default GM;
