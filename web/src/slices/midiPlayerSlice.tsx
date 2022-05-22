import { createSlice } from "@reduxjs/toolkit";
import GM from "../classes/GM";

export interface IPlayerState {
	baseUrl: string;
	isLoaded: boolean;
	isLoading: boolean;
	isAvailable: boolean;
	isPlaying: boolean;
	areAudioBuffersLoaded: boolean;
}

export type SoundFormat = "mp3" | "ogg";
export interface ISoundFontPayload {
	fontFamily: string;
	instrument: Array<string>;
	format: SoundFormat;
	compressed: boolean;
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

const initialState: IPlayerState = {
	baseUrl: "https://sounds.steptunes.com",
	isLoaded: false,
	isLoading: false,
	isAvailable: false,
	isPlaying: false,
	areAudioBuffersLoaded: false
}

const midiPlayerSlice = createSlice({
	name: "midi",
	initialState,
	reducers: {
		setPlayer: (state) => {
			/**
			 * We are adding the MIDI object to the browser window because of the way
			 * the current sound fonts and MidiJS were structured.
			 * 
			 * TODO: restructure so we don't have to do this - although because of the 
			 * TODO: desire for state to only have serializable data, this may be a 
			 * TODO: good solution for the general midi object - as it's not really a state 
			 * TODO: item anyways
			 */
			(window as any).MIDI = new GM();
			state.isAvailable = true;
		},
		loadSoundFont: (state, action) => {
			const compressionExtension: string = action.payload.compressed ? ".gz" : "";
			let loadSound: HTMLScriptElement;
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
		loadSoundFontComplete: (state) => {
			state.isLoading = false;
			state.isLoaded = true;

			// TODO: move to own action just in here for debugging purposes
			const options = {
				soundFonts: [
					"acoustic_grand_piano", 
					"slap_bass_1"
				]
			};
			const midiChannel = 0;
			window.MIDI.channels[midiChannel].player.connect(options);
			const intstrumentId = window.MIDI.getInstrumentIDbyName('acoustic_grand_piano');
			state.areAudioBuffersLoaded = true;
			setTimeout(() => {
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'C4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'E4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'G4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'B5', 0, 0)

				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'D4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'F4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'A4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(intstrumentId, 'C5', 0, 2)
			}, 300);
		}, 
		playSequence: (state, action) => {
			console.log("Play Sequence", action.payload);
			const MIDI = window.MIDI;
			if (state.isLoaded && state.areAudioBuffersLoaded) {
				//
				// TODO: implement isPlaying, clearSequence, etc
				//
				action.payload.sequence.forEach((soundItem: any) => {
					console.log("Sound Item", soundItem);
					MIDI.channels[action.payload.channelId].player.noteOn(
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

export const { setPlayer, loadSoundFont, loadSoundFontComplete, playSequence } = midiPlayerSlice.actions;

export default midiPlayerSlice.reducer;
