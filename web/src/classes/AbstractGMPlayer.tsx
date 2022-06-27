export interface IOptions {
	soundFonts: Array<string>;
	loadCallback?: Function;
}

export interface INoteOptions {
	instrumentId: number;
	note: string;
	velocity: number;
	delay: number;
	duration: number;
	shouldFade: boolean;
	fadeDuration: number;
}

abstract class GMPlayer {

	/* eslint-disable-next-line */
	constructor() {
	}

	abstract send (data: any, delay: number): void;
	abstract setController (channelId: number, type: string, value: number, delay: number): void;
	abstract setVolume (channelId: number, volume: number, delay: number): void;
	abstract programChange (channelId: number, program: number, delay: number): void;
	abstract pitchBend (channelId: number, program: number, delay: number): void;
	abstract noteOn (options: INoteOptions): void;
	abstract noteOff (channelId: number, note: string, delay: number): void;
	abstract chordOn (channelId: number, chord: string, velocity: number, delay: number): void;
	abstract chordOff (channelId: number, chord: string, delay: number): void;
	abstract stopAllNotes (): void;
	abstract connect (options: IOptions): void;
}

export default GMPlayer;
