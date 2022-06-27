//import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GM from "../classes/GM";
import { INoteOptions } from "../classes/AbstractGMPlayer";

const MAX_CHANNELS = 16;  // !! move to Parameter Store in AWS System Manager

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

export interface ISequencePayload {
	channelId: number,
	sequence: Array<INoteOptions>
}

export interface IChannels {
	areAudioBuffersLoading: boolean;
	areAudioBuffersLoaded: boolean;
	isPlaying: boolean;
}

export interface IPlayerState {
	baseUrl: string;
	isLoaded: boolean;
	isLoading: boolean;
	loadingCount: number;
	isAvailable: boolean;
	isPlaying: boolean;
	channels: Array<IChannels>;
}
/**
 * #### Create the Channel States
 *
 * @returns {*} 
 */
const initchannels = (): Array<IChannels> => {
	const channels: Array<IChannels> = [];
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
	loadingCount: 0,
	isAvailable: false,
	isPlaying: false,
	channels: initchannels()
}

/** 
 * #### Asynchronously Load Sound Fonts
 * 
 * Attach a variable number Sound Font scripts to the DOM and let them install themselves into the MIDI global
 * object. SoundFonts can be used by any channel and hence are global within the General MIDI engine.  However, they are
 * not loaded in the audio.context for each channel - that is a separate action as each channel may not 
 * require the use of every sound font globally available.
 * 
 * TODO: Add typing for async see: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * @param instrumentSourceUrl			the full URL of the Sound Font
 */
 export const asyncLoadSoundFont = createAsyncThunk(
	"midi/asyncLoadSoundFont", 
	async (instrumentSourceUrl: string) => {
		return new Promise<any>((resolve, reject) => {
			/**
			 * attach the sound font script element to the DOM
			 */
			let loadSound: HTMLScriptElement = document.createElement("script");
			loadSound.type = "text/javascript";
			loadSound.src = instrumentSourceUrl;
			document.body.appendChild(loadSound);
			/**
			 * resolve promise if loading of script element succeeds
			 */
			loadSound.onload = (event: any) => {
				console.log("asyncLoadSoundFont:", instrumentSourceUrl, event);
				resolve(instrumentSourceUrl);
			}
			/**
			 * reject promise if loading of script element fails
			 */
			loadSound.onerror = (event: any) => {
				console.error("asyncLoadSoundFont:", instrumentSourceUrl, event);
				reject(instrumentSourceUrl);
			}
		});
	}
);

const midiPlayerSlice = createSlice({
	name: "midi",
	initialState,
	reducers: {
		/**
		 * #### Set MIDI Engine
		 * 
		 * Create the General MIDI Engine and attach to the DOM.
		 * 
		 * !! We are adding the MIDI object to the browser window because of the way
		 * !! the current sound fonts and MidiJS were structured.
		 * 
		 * TODO: create a d.ts file for the GM MIDI Engine so we can get rid off the window.MIDI reference for just MIDI
		 * TODO: restructure so we don't have to do this - although because of the 
		 * TODO: desire for state to only have serializable data, this may be a 
		 * TODO: good solution for the general midi object - as it's not really a state 
		 * TODO: item anyways
		 * 
		 * TODO: Should we support channel states and player state with their own slices?
		 */ 
		//setMidiEngine: (state: IPlayerState, action: PayloadAction<ISequencePayload>) => {
		setMidiEngine: (state, action) => {
			window.MIDI = new GM(action.payload.numberOfChannels);
			state.isAvailable = true;
		},

		/** 
		 * #### Activate the Specified Channel
		 * 
		 * Determine if the channel exists, if not add it. Verify that is was successfully added or already existed
		 * and connect to the channel, transcode and load the specified soundfonts into the audio context buffers for playback.
		 */
		channelActivate: (state, action) => {
			/** 
			 * need to create the channel?
			 */
			if (!window.MIDI.channels[action.payload.channelId]) {
				window.MIDI.addChannel(action.payload.channelId);
			}
			/** 
			 * channel exist?
			 */
			if (window.MIDI.channels[action.payload.channelId]) {
				window.MIDI.channels[action.payload.channelId].player.connect({
					soundFonts: action.payload.soundFonts,
					loadCallback: action.payload.loadCallback
				});

				state.channels[action.payload.channelId].areAudioBuffersLoading = true;
			} else {
				console.error("GM.channelActivate: Channel Does Not Exist.  Channel = " + action.payload.channelId);
			}
		},

		/** 
		 * #### Channel Activation Complete
		 * 
		 * Updates the audioBuffers loading and loaded states.
		 */
		channelActivationComplete: (state, action) => {
			state.channels[action.payload.channelId].areAudioBuffersLoaded = true;
			state.channels[action.payload.channelId].areAudioBuffersLoading = false;
		},

		/** 
		 * #### Play a MIDI sequence
		 * 
		 * TODO: implement isPlaying, clearSequence, etc
		 */
		playSequence: (state, action) => {
			/** 
			 * Make sure the soundFonts and Audio Buffers were properly loaded
			 */
			if (state.isLoaded && state.channels[action.payload.channelId].areAudioBuffersLoaded) {
				let isPlaying = false;
				action.payload.sequence.forEach((soundItem: INoteOptions ) => {
					window.MIDI.channels[action.payload.channelId].player.noteOn(soundItem);
					isPlaying = true;
				});
				state.isPlaying = isPlaying;
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(asyncLoadSoundFont.pending, (state) => {
			state.isLoading = true;
			state.loadingCount += 1;
		});

		builder.addCase(asyncLoadSoundFont.fulfilled, (state, action) => {
			state.loadingCount -= 1;
			console.log("asyncLoadSoundFont.fulfilled: Action:", action);
			if (state.loadingCount <= 0) {
				state.isLoading = false;
				state.isLoaded = true;
			}
		});

		builder.addCase(asyncLoadSoundFont.rejected, (state) => {
			state.isLoading = false;
			state.isLoaded = false;
		});
	}
});

export const {
	setMidiEngine,
	playSequence,
	channelActivate,
	channelActivationComplete
} = midiPlayerSlice.actions;

export default midiPlayerSlice.reducer;
