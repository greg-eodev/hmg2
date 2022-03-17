import React from "react"
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
/**
 * Icons
 */
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import SchoolIcon from "@mui/icons-material/School";
import SettingsInputSvideoIcon from "@mui/icons-material/SettingsInputSvideo";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
/**
 * HMG
 */
import { openDrawer, closeDrawer } from "../slices/mainDrawerSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks"

const MainDrawer = () => {
	const isVisible = useAppSelector((state) => state.drawer.isVisible);
	const dispatch = useAppDispatch();

	const toggleDrawer = () => (event: any) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return;
		}

		dispatch(isVisible ? closeDrawer() : openDrawer());
	};

	const list = () => (
		<Box
			sx={{ width: 300 }}
			role="presentation"
			onClick={toggleDrawer()}
			onKeyDown={toggleDrawer()}
		>
		<List>
			<ListItem button key={"Harmonagon"}>
				<ListItemIcon>
					<PlayCircleOutlineIcon />
				</ListItemIcon>
				<ListItemText primary={"Harmonagon"} />
			</ListItem>
			<ListItem button key={"Music"}>
				<ListItemIcon>
					<MusicNoteIcon />
				</ListItemIcon>
				<ListItemText primary={"Music"} />
			</ListItem>
			<ListItem button key={"Library"}>
				<ListItemIcon>
					<LibraryMusicIcon />
				</ListItemIcon>
				<ListItemText primary={"Library"} />
			</ListItem>
		</List>
		<Divider />
		<List>
			<ListItem button key={"Learning"}>
				<ListItemIcon>
					<SchoolIcon />
				</ListItemIcon>
				<ListItemText primary={"Learning"} />
			</ListItem>
			<ListItem button key={"MIDI"}>
				<ListItemIcon>
					<SettingsInputSvideoIcon />
				</ListItemIcon>
				<ListItemText primary={"MIDI"} />
			</ListItem>
		</List>
		</Box>
	);

	return (
		<div>
			<React.Fragment key={"drawerLeft"}>
				<Drawer
					anchor="left"
					open={isVisible}
					onClose={toggleDrawer()}
				>
					{list()}
				</Drawer>
			</React.Fragment>
		</div>
	);
}

export default MainDrawer;
