import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

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

const App = () => {
	return (
		<Container maxWidth="sm">
		<Box sx={{ my: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Harmonagon Redux
			</Typography>
			<p>Welcome the the rebirth ... re-emergence ... re-something of<br /><strong><Link color="inherit" href="http://harmonagon.com/">The Harmonagon Project</Link></strong></p>
			<Copyright />
		</Box>
		</Container>
	);
}

export default App;
