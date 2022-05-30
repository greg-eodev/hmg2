import { createSlice } from "@reduxjs/toolkit";
import GM from "../classes/GM";

const MAX_CHANNELS = 16;

export interface Ichannels {
	areAudioBuffersLoading: boolean;
	areAudioBuffersLoaded: boolean;
	isPlaying: boolean;
}

export interface IPlayerState {
	baseUrl: string;
	isLoaded: boolean;
	isLoading: boolean;
	isAvailable: boolean;
	isPlaying: boolean;
	channels: Array<Ichannels>;
}

export type SoundFormat = "mp3" | "ogg";
export interface ISoundFontPayload {
	fontFamily: string;
	instrument: Array<string>;
	format: SoundFormat;
	compressed: boolean;
	loadCallback: Function;
}

export interface IChannelActivatePayload {
	channelId: number;
	soundFonts: Array<string>;
	loadCallback: Function;
}

export interface ISoundItem {
	instrumentId: number;
	note: string;
	velocity: number;
	delay: number;
	duration: number;
}

export interface ISequencePayload {
	channelId: number,
	sequence: Array<ISoundItem>
}

const initchannels = (): Array<Ichannels> => {
	const channels: Array<Ichannels> = [];
	for (let i = 0; i < MAX_CHANNELS; i++) {
		channels.push({
			areAudioBuffersLoading: false,
			areAudioBuffersLoaded: false,
			isPlaying: false
		});
	}
	return channels;
}

const initialState: IPlayerState = {
	baseUrl: "https://sounds.steptunes.com",
	isLoaded: false,
	isLoading: false,
	isAvailable: false,
	isPlaying: false,
	channels: initchannels()
}

const midiPlayerSlice = createSlice({
	name: "midi",
	initialState,
	reducers: {
		/**
		 * #### Set MIDI Engine
		 * 
		 * Create the General MIDI Engine and attach to the DOM
		 * 
		 * !! We are adding the MIDI object to the browser window because of the way
		 * !! the current sound fonts and MidiJS were structured.
		 * 
		 * TODO: create a d.ts file for the GM MIDI Engine so we can get rid off the window.MIDI reference for just MIDI
		 * TODO: restructure so we don't have to do this - although because of the 
		 * TODO: desire for state to only have serializable data, this may be a 
		 * TODO: good solution for the general midi object - as it's not really a state 
		 * TODO: item anyways
		 */ 
		setMidiEngine: (state) => {
			/**

			 * 
			 */
			const numberOfChannels = 1;
			window.MIDI = new GM(numberOfChannels);
			state.isAvailable = true;
		},
		/** 
		 * #### Load Sound Fonts
		 * 
		 * Attach a variable number Sound Font scripts to the DOM and let them install themselves into the MIDI global
		 * object. SoundFonts can be used by any channel and hence are global within the General MIDI engine.  However, they are
		 * not loaded in the audio.context for each channel - that is a separate action as each channel may not 
		 * require the use of every sound font globally available.
		 * 
		 * Attach a callback to the **element.onLoad** event to track the loading completion of each of the scripts which should
		 * dispatch the **loadSoundFontComplete** action when all soundFonts have been loaded.
		 */
		loadSoundFont: (state, action) => {
			const compressionExtension: string = action.payload.compressed ? ".gz" : "";
			let loadSound: HTMLScriptElement;
			/** 
			 * are there any sound fonts to load?  If so, set the isLoading state and load them
			 */
			if (action.payload.instrument.length > 0) {
				state.isLoading = true;
				action.payload.instrument.forEach((instrument: string) => {
					loadSound = document.createElement("script");
					loadSound.type = "text/javascript";
					loadSound.src = `${state.baseUrl}/${action.payload.fontFamily}/${instrument}-${action.payload.format}.js${compressionExtension}`;
					document.body.appendChild(loadSound);
					loadSound.onload = () => { action.payload.loadCallback(); }
				});
			}
		},
		/** 
		 * #### Load Sound Fonts Complete
		 * 
		 * Updates the loading and loaded state
		 */
		loadSoundFontComplete: (state) => {
			state.isLoading = false;
			state.isLoaded = true;
		},
		/** 
		 * #### Activate the Specified Channel
		 * 
		 * Updates the loading and loaded state
		 */
		channelActivate: (state, action) => {
			const options = {
				soundFonts: action.payload.soundFonts,
				loadCallback: action.payload.loadCallback
			};
			window.MIDI.channels[action.payload.channelId].player.connect(options);
			state.channels[action.payload.channelId].areAudioBuffersLoading = true;
		},
		channelActivationComplete: (state, action) => {
			// TODO: support channel state - channel states, player states with slices
			state.channels[action.payload.channelId].areAudioBuffersLoaded = true;
			state.channels[action.payload.channelId].areAudioBuffersLoading = false;
		},
		playSequence: (state, action) => {
			if (state.isLoaded && state.channels[action.payload.channelId].areAudioBuffersLoaded) {
				//
				// TODO: implement isPlaying, clearSequence, etc
				//
				action.payload.sequence.forEach((soundItem: any) => {
					window.MIDI.channels[action.payload.channelId].player.noteOn(
						soundItem.instrumentId, 
						soundItem.note, 
						soundItem.velocity,
						soundItem.delay,
						soundItem.duration,
					);
				});
			}
		}
	}
});

export const {
	setMidiEngine,
	loadSoundFont,
	loadSoundFontComplete,
	playSequence,
	channelActivate,
	channelActivationComplete
} = midiPlayerSlice.actions;

export default midiPlayerSlice.reducer;
