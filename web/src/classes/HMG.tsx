import Phaser from "phaser";

class HMG extends Phaser.Game {
	public version: string;

	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.version = "2.0.0-dev.1";
	}
}

export default HMG;
