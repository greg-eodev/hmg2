import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
/**
 * HMG
 */
import Footer from "./containers/Footer";
import MainDrawer from "./components/MainDrawer";
import Draw from "./components/Draw";
import MidiPlayer from "./components/MidiPlayer";
import { playSequence, ISequencePayload } from "./slices/midiPlayerSlice";
import { useAppDispatch } from "./hooks/hooks"

const App = () => {
	const dispatch = useAppDispatch();

	const clickPlaySequence = () => {
		const instrument1 = window.MIDI.getInstrumentIDbyName('tenor_sax')
		const instrument2 = window.MIDI.getInstrumentIDbyName('french_horn')
		const payload: ISequencePayload = {
			channelId: 0,
			sequence: [
				{
					instrumentId: instrument1,
					note: 'C4',
					velocity: 0,
					delay: 2,
					duration: 1.5,					
				},
				{
					instrumentId: instrument2,
					note: 'C3',
					velocity: 0,
					delay: 2,
					duration: 3.0,					
				},
				{
					instrumentId: instrument1,
					note: 'G4',
					velocity: 0,
					delay: 4,
					duration: 2,					
				},
				{
					instrumentId: instrument1,
					note: 'D4',
					velocity: 0,
					delay: 6,
					duration: 2,					
				},
				{
					instrumentId: instrument1,
					note: 'A4',
					velocity: 0,
					delay: 8,
					duration: 2,					
				},
				{
					instrumentId: instrument2,
					note: 'A2',
					velocity: 0,
					delay: 8,
					duration: 3,					
				},
				{
					instrumentId: instrument1,
					note: 'E4',
					velocity: 0,
					delay: 10,
					duration: 2,					
				},
				{
					instrumentId: instrument1,
					note: 'B4',
					velocity: 0,
					delay: 12,
					duration: 3,					
				},
				{
					instrumentId: instrument2,
					note: 'B2',
					velocity: 0,
					delay: 12,
					duration: 3,					
				},
			]
			
		}

		dispatch(playSequence(payload));
	};

	return (
		<Container maxWidth="lg">
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					StepTunes
				</Typography>				
				<Typography variant="h6" component="h1" gutterBottom>
					Something completely different!
				</Typography>
				<p>
					Welcome the the rebirth ... re-emergence ... re-something of<br />
					<strong><Link color="inherit" href="http://harmonagon.com/">The Harmonagon Project</Link></strong>
				</p>
				<Draw />
				<Button onClick={() => { clickPlaySequence() }} variant="outlined" >
					Bring Da Noise
				</Button>
				<Footer />
			</Box>
			<MainDrawer />
			<MidiPlayer />
		</Container>	
	);
}

export default App;
