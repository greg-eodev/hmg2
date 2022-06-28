import React from "react";
import { useEffect } from "react";
/**
 * HMG
 */
import { setMidiEngine, channelActivate, IChannelActivatePayload, channelActivationComplete, asyncLoadSoundFont} from "../slices/midiPlayerSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks"

const MidiPlayer = () => {
	const isAvailable = useAppSelector((state) => state.midi.isAvailable);
	const isLoaded = useAppSelector((state) => state.midi.isLoaded);
	const isLoading = useAppSelector((state) => state.midi.isLoading);
	const baseUrl = useAppSelector((state) => state.midi.baseUrl);
	const channels = useAppSelector((state) => state.midi.channels);
	const dispatch = useAppDispatch();
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
	const instruments = ["tenor_sax", "french_horn"];
	if (isAvailable && !isLoaded && !isLoading) {
		let soundSource: string;
		instruments.forEach((instrument) => {
			soundSource = `${baseUrl}/fat-boy/${instrument}-mp3.js`;
			dispatch(asyncLoadSoundFont(soundSource));
		});
	} else if (isAvailable && isLoaded && !channels[0].areAudioBuffersLoading && !channels[0].areAudioBuffersLoaded) {
		const payload: IChannelActivatePayload = {
			channelId: 0,
			soundFonts: instruments,
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
