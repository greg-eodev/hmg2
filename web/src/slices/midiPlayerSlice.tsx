import { createSlice } from "@reduxjs/toolkit";
import GM from "../classes/GM";

export interface IPlayerState {
	baseUrl: string;
	isLoaded: boolean;
	isLoading: boolean;
	isAvailable: boolean;
	isPlaying: boolean;
}

export type SoundFormat = "mp3" | "ogg";
export interface ISoundFontPayload {
	fontFamily: string;
	instrument: Array<string>;
	format: SoundFormat;
	compressed: boolean;
	loadCallback: Function;
}

const initialState: IPlayerState = {
	baseUrl: "https://sounds.steptunes.com",
	isLoaded: false,
	isLoading: false,
	isAvailable: false,
	isPlaying: false
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
			setTimeout(() => {
				window.MIDI.channels[midiChannel].player.noteOn(0, 'C4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'E4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'G4', 0, 0)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'B5', 0, 0)

				window.MIDI.channels[midiChannel].player.noteOn(0, 'D4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'F4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'A4', 0, 2)
				window.MIDI.channels[midiChannel].player.noteOn(0, 'C5', 0, 2)
			}, 300);
		}
	}
});

export const { setPlayer, loadSoundFont, loadSoundFontComplete } = midiPlayerSlice.actions;

export default midiPlayerSlice.reducer;
