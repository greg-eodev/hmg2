import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from '@mui/material/AppBar';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SchoolIcon from '@mui/icons-material/School';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import React from "react";

const Copyright = () => {
	return (
		<Typography variant="body2" color="white" align="center">
			{'Copyright © 2016 - '}
			{new Date().getFullYear()}
			&nbsp;Radical Data and Media LLC
			{'.'}
		</Typography>
	);
}

const Footer = () => {
	const [state, setState] = React.useState({
		"left": false,
	});

	const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const list = (anchor: string) => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
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
		<React.Fragment>
			<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 4 }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer("left", true)}>
						<MenuIcon />
					</IconButton>
					<Box textAlign="center" sx={{ flexGrow: 1 }}>
						<Copyright />
					</Box>
					<IconButton color="inherit">
						<SearchIcon />
					</IconButton>
					<IconButton color="inherit">
						<MoreIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer
				anchor="left"
				open={state["left"]}
				onClose={toggleDrawer("left", false)}
			>
				{list("left")}
			</Drawer>
		</React.Fragment>
	);
}

export default Footer;

