import React from "react";
import { useEffect } from "react";
import Phaser from "phaser";
/**
 * HMG
 */
 import HMG from "../classes/HMG";
 import { setCanvas, setPhaser } from "../slices/drawSlice";
 import { useAppSelector, useAppDispatch } from "../hooks/hooks"

const Draw = () => {
	const isVisible = useAppSelector((state) => state.draw.isVisible);
	const dispatch = useAppDispatch();

	const config: Phaser.Types.Core.GameConfig = {
		title: "Harmonagon Redux",
		width: 600,
		height: 600,
		parent: "hmg",
		backgroundColor: "#000000"
	}

	useEffect(() => {
		if (!isVisible) {
			const game = new HMG(config);
			const payload = {
				phaser: game
			}
			dispatch(setPhaser(payload));
			dispatch(setCanvas());
		}
	});

	return (
		<React.Fragment>
			<div id="hmg"></div>
		</React.Fragment>
	)
}

export default Draw;
