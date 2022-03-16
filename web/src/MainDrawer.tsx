import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const MainDrawer = () => {
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
			{["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
			<ListItem button key={text}>
				<ListItemIcon>
					{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
				</ListItemIcon>
				<ListItemText primary={text} />
			</ListItem>
			))}
		</List>
		<Divider />
		<List>
			{["All mail", "Trash", "Spam"].map((text, index) => (
			<ListItem button key={text}>
				<ListItemIcon>
					{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
				</ListItemIcon>
				<ListItemText primary={text} />
			</ListItem>
			))}
		</List>
		</Box>
	);

	return (
		<div>
			<React.Fragment key={"left"}>
			<Button onClick={toggleDrawer("left", true)}>Left</Button>
			<Drawer
				anchor="left"
				open={state["left"]}
				onClose={toggleDrawer("left", false)}
			>
				{list("left")}
			</Drawer>
			</React.Fragment>
		</div>
	);
}

export default MainDrawer;
