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
	/**
	 * When page loads create the player on the DOM
	 */
	useEffect(() => {
		if (!isAvailable) {
			dispatch(setPlayer());
		}
	});
	/**
	 * Load default sound font(s)
	 * + player is set and available
	 * + no other sound font(s) loaded
	 * + loading sound font(s) not in progress
	 * 
	 * TODO: Set format based on canPlayType
	 */
	if (isAvailable && !isLoaded && !isLoading) {
		//const audioSupport = window.MIDI.getAudioSupport();
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
