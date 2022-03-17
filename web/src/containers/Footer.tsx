import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
/**
 * Icons
 */
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
/**
 * HMG
 */
import { openDrawer } from "../slices/mainDrawerSlice";
import { useAppDispatch } from "../hooks/hooks"

const Copyright = () => {
	return (
		<Typography variant="body2" color="white" align="center">
			{"Copyright © 2016 - "}
			{new Date().getFullYear()}
			&nbsp;The Harmonagon Collective.
		</Typography>
	);
}

const Footer = () => {
	const dispatch = useAppDispatch();

	return (
		<React.Fragment>
			<AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 4 }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" onClick={() => { dispatch(openDrawer()) }}>
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
		</React.Fragment>
	);
}

export default Footer;

