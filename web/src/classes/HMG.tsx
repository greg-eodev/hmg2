import Phaser from "phaser";

class HMG extends Phaser.Game {
	public init: number;
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.init = 1;
	}
}

export default HMG;
