import GMPlayer from "./AbstractGMPlayer"

class GMPlayerWebAudio extends GMPlayer {

	constructor () {
		super();


	}

	public send = (data: any, delay: number): void => { };
	public setController = (channelId: number, type: string, value: number, delay: number): void => { };
	public setVolume = (channelId: number, volume: number, delay: number): void => { };
	public programChange = (channelId: number, program: number, delay: number): void => { };
	public pitchBend = (channelId: number, program: number, delay: number): void => { };
	public noteOn = (channelId: number, noteId: string, velocity: number, delay: number): void => { };
	public noteOff = (channelId: number, noteId: string, delay: number): void => { };
	public chordOn = (channelId: number, chord: string, velocity: number, delay: number): void => { };
	public chordOff = (channelId: number, chord: string, delay: number): void => { };
	public stopAllNotes = (): void => { };
	public connect = (opts: Array<string>): void => { };
}

export default GMPlayerWebAudio;
