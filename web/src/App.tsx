import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
/**
 * HMG
 */
import Footer from "./containers/Footer";
import MainDrawer from "./components/MainDrawer";
import Draw from "./components/Draw";
import GM from "./classes/GM";


const App = () => {

	const generalMidi = new GM();
	console.log("Midi: ", generalMidi);

	return (
		<Container maxWidth="lg">
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Harmonagon Redux
				</Typography>
				<p>
					Welcome the the rebirth ... re-emergence ... re-something of<br />
					<strong><Link color="inherit" href="http://harmonagon.com/">The Harmonagon Project</Link></strong>
				</p>
				<Draw />
				<Footer />
			</Box>
			<MainDrawer />
		</Container>
	);
}

export default App;
