import React from "react";
import { useEffect } from "react";
/**
 * HMG
 */
import { setMidiEngine, loadSoundFont, ISoundFontPayload, loadSoundFontComplete, channelActivate, IChannelActivatePayload, channelActivationComplete} from "../slices/midiPlayerSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks"

const MidiPlayer = () => {
	const isAvailable = useAppSelector((state) => state.midi.isAvailable);
	const isLoaded = useAppSelector((state) => state.midi.isLoaded);
	const isLoading = useAppSelector((state) => state.midi.isLoading);
	const channels = useAppSelector((state) => state.midi.channels);
	const dispatch = useAppDispatch();
	let soundFontCount: number;
	let loadedSoundFontCount: number;
	/**
	 * When page loads create the player on the DOM
	 */
	useEffect(() => {
		if (!isAvailable) {
			dispatch(setMidiEngine({ numberOfChannels: 1 }));
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
			instrument: ["tenor_sax", "french_horn"],
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

	} else if (isAvailable && isLoaded && !channels[0].areAudioBuffersLoading && !channels[0].areAudioBuffersLoaded) {
		const payload: IChannelActivatePayload = {
			channelId: 0,
			soundFonts: [
				"tenor_sax", 
				"french_horn"
			],
			"loadCallback": () => {
				--loadedSoundFontCount;
				if (loadedSoundFontCount <= 0) {
					dispatch(channelActivationComplete({channelId: 0}));
				} 
			}
		}
		loadedSoundFontCount = payload.soundFonts.length * 88;
		dispatch(channelActivate(payload));
	}

	return (
		<React.Fragment>
			<div id="step-tunes-midi-player"></div>
		</React.Fragment>
	)
}

export default MidiPlayer;
