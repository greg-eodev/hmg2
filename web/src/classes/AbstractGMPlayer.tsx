
export interface IOptions {
	soundFonts: Array<string>;
	loadCallback?: Function;
}

abstract class GMPlayer {

	/* eslint-disable-next-line */
	constructor() {
	}

	// TODO: specific for webAudio player => abstract setEffects (list: Array<string>): void;
	// TODO: specific for webAudio player => abstract getContext (): void; // should return context
	// TODO: specific for webAudio player => abstract setContext (newCtx: number, onload: Function, onprogress: Function, onerror: Function): void;

	abstract send (data: any, delay: number): void;
	abstract setController (channelId: number, type: string, value: number, delay: number): void;
	abstract setVolume (channelId: number, volume: number, delay: number): void;
	abstract programChange (channelId: number, program: number, delay: number): void;
	abstract pitchBend (channelId: number, program: number, delay: number): void;
	abstract noteOn (instrumentId: number, note: string, velocity: number, delay: number): void;
	abstract noteOff (channelId: number, note: string, delay: number): void;
	abstract chordOn (channelId: number, chord: string, velocity: number, delay: number): void;
	abstract chordOff (channelId: number, chord: string, delay: number): void;
	abstract stopAllNotes (): void;
	abstract connect (options: IOptions): void;
}

export default GMPlayer;
