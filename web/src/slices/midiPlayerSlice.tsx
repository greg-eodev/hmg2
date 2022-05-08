import { createSlice } from "@reduxjs/toolkit";
import GM from "../classes/GM";

interface IPlayerState {
	baseUrl: string;
	isLoaded: boolean;
	isAvailable: boolean;
	isPlaying: boolean;
}

const initialState: IPlayerState = {
	baseUrl: "https://sounds.steptunes.com",
	isLoaded: false,
	isAvailable: false,
	isPlaying: false
}


export interface ISoundFontPayload {
	fontFamily: string;
	instrument: Array<string>;
	format: "mp3" | "ogg";
	compressed: boolean;
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
			const compressionExtension = action.payload.compressed ? ".gz" : "";
			let source: string = "";
			let loadSound;
			if (action.payload.instrument.length > 0) {
				action.payload.instrument.forEach((instrument: string) => {
					source = state.baseUrl + "/" + action.payload.fontFamily + "/" + instrument + "-" + action.payload.format + ".js" + compressionExtension;
					loadSound = document.createElement("script");
					loadSound.type = "text/javascript";
					loadSound.src = source;
					document.body.appendChild(loadSound);
				})
				state.isLoaded = true;
			}
		}
	}
});

export const { setPlayer, loadSoundFont } = midiPlayerSlice.actions;

export default midiPlayerSlice.reducer;
