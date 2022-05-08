import React from "react";
import { useEffect } from "react";
/**
 * HMG
 */
import { setPlayer, loadSoundFont, ISoundFontPayload } from "../slices/midiPlayerSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks"
//import { useLoadSoundQuery } from "../slices/soundFontSlice"


const MidiPlayer = () => {
	const isAvailable = useAppSelector((state) => state.midi.isAvailable);
	const isLoaded = useAppSelector((state) => state.midi.isLoaded);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!isAvailable) {
			dispatch(setPlayer());
		}
	});

	if (isAvailable && !isLoaded) {
		const payload: ISoundFontPayload = {
			fontFamily: "fat-boy",
			instrument: ["acoustic_grand_piano", "slap_bass_1"],
			format: "mp3",
			compressed: false
		}
		dispatch(loadSoundFont(payload));
	}

	/*
		console.log("Load default sound font");
		const {
			data: soundFont,
			isLoading,
			isSuccess,
			isError,
			error
		} = useLoadSoundQuery("fat-boy/acoustic_grand_piano-mp3.js");
		if (isLoading) {
			console.log("Loading...");
		} else if (isSuccess) {
			console.log("Success", soundFont);
		} else if (isError) {
			console.error("Error", error);
		} else {
			console.error('Some other')
		}
	*/

	return (
		<React.Fragment>
			<div id="step-tunes-midi-player"></div>
		</React.Fragment>
	)
}

export default MidiPlayer;
