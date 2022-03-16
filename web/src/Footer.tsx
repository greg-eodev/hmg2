import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import AppBar from '@mui/material/AppBar';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

const Copyright = () => {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Copyright © 2016 - '}
			{new Date().getFullYear()}
			&nbsp;Radical Data and Media LLC
			{'.'}
		</Typography>
	);
}
/*
const Footer = () => {
	return (
		<footer>
			<Box bgcolor="text.secondary" color="white">
				<Container maxWidth="lg">
					<Grid container spacing={5}>
						<Grid item xs={12} sm={4}>
							<Box borderBottom={1}>Help</Box>
							<Box>
								<Link href="/" color="inherit">
									Contact
								</Link>
							</Box>
							<Box>
								<Link href="/" color="inherit">
									Support
								</Link>
							</Box>
							<Box>
								<Link href="/" color="inherit">
									Privacy
								</Link>
							</Box>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Box borderBottom={1}>Account</Box>
							<Box>
								<Link href="/" color="inherit">
									Login
								</Link>
							</Box>
							<Box>
								<Link href="/" color="inherit">
									Create
								</Link>
							</Box>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Box borderBottom={1}>Tools</Box>
							<Box>
								<Link href="/" color="inherit">
									Harmonagon
								</Link>
							</Box>
							<Box>
								<Link href="/" color="inherit">
									API
								</Link>
							</Box>
						</Grid>
					</Grid>
					<Box textAlign="center">
						<Copyright />
					</Box>
				</Container>
			</Box>
		</footer>
	);
}
*/

const Footer = () => {
	return (
		<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
			<Toolbar>
			<IconButton color="inherit" aria-label="open drawer">
				<MenuIcon />
			</IconButton>
			<Box sx={{ flexGrow: 1 }} />
			<IconButton color="inherit">
				<SearchIcon />
			</IconButton>
			<IconButton color="inherit">
				<MoreIcon />
			</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default Footer;

