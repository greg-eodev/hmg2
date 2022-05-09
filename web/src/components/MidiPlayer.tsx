import React from "react";
import { useEffect } from "react";
/**
 * HMG
 */
import { setPlayer, loadSoundFont, ISoundFontPayload, loadSoundFontComplete } from "../slices/midiPlayerSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks"

const MidiPlayer = () => {
	const isAvailable = useAppSelector((state) => state.midi.isAvailable);
	const isLoaded = useAppSelector((state) => state.midi.isLoaded);
	const isLoading = useAppSelector((state) => state.midi.isLoading);
	const dispatch = useAppDispatch();
	let soundFontCount: number;

	useEffect(() => {
		if (!isAvailable) {
			dispatch(setPlayer());
		}
	});

	/**
	 * Load default sound fonts if there is nothing loaded
	 */
	if (isAvailable && !isLoaded && !isLoading) {
		const payload: ISoundFontPayload = {
			fontFamily: "fat-boy",
			instrument: ["acoustic_grand_piano", "slap_bass_1"],
			format: "mp3",
			compressed: false,
			"loadCallback": () => {
				--soundFontCount;
				if (soundFontCount <= 0) {
					dispatch(loadSoundFontComplete());
				} 
			}
		}
		soundFontCount = payload.instrument.length;
		dispatch(loadSoundFont(payload));
	}

	return (
		<React.Fragment>
			<div id="step-tunes-midi-player"></div>
		</React.Fragment>
	)
}

export default MidiPlayer;
