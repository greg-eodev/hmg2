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
		const instrument1 = window.MIDI.getInstrumentIdByName('tenor_sax')
		const instrument2 = window.MIDI.getInstrumentIdByName('french_horn')
		const payload: ISequencePayload = {
			channelId: 0,
			sequence: [
				{
					instrumentId: instrument1,
					note: 'C4',
					velocity: 0,
					delay: 0,
					duration: 1.5,
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument2,
					note: 'C2',
					velocity: 0,
					delay: 0,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'G4',
					velocity: 0,
					delay: 1,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'D4',
					velocity: 0,
					delay: 2,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'A4',
					velocity: 0,
					delay: 3,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument2,
					note: 'A2',
					velocity: 0,
					delay: 3,
					duration: 1.5,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'E4',
					velocity: 0,
					delay: 4,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'B4',
					velocity: 0,
					delay: 5,
					duration: 1.5,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'Gb4',
					velocity: 0,
					delay: 6,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'Db4',
					velocity: 0,
					delay: 7,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument2,
					note: 'Db2',
					velocity: 0,
					delay: 7,
					duration: 1.5,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'Ab4',
					velocity: 0,
					delay: 8,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'Eb4',
					velocity: 0,
					delay: 9,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'Bb4',
					velocity: 0,
					delay: 10,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument2,
					note: 'Bb2',
					velocity: 0,
					delay: 10,
					duration: 1.5,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'F4',
					velocity: 0,
					delay: 11,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'C5',
					velocity: 0,
					delay: 12,
					duration: 1,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument2,
					note: 'C3',
					velocity: 0,
					delay: 12,
					duration: 1.5,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'C4',
					velocity: 0,
					delay: 13.5,
					duration: 0.25,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'C5',
					velocity: 0,
					delay: 13.5,
					duration: 0.25,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'E4',
					velocity: 0,
					delay: 13.5,
					duration: 0.25,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'G4',
					velocity: 0,
					delay: 13.5,
					duration: 0.25,					
					shouldFade: false,
					fadeDuration: 0					
				},
				{
					instrumentId: instrument1,
					note: 'C4',
					velocity: 0,
					delay: 13.75,
					duration: 3,					
					shouldFade: true,
					fadeDuration: 0.5					
				},
				{
					instrumentId: instrument1,
					note: 'C5',
					velocity: 0,
					delay: 13.75,
					duration: 3,					
					shouldFade: true,
					fadeDuration: 0.5					
				},
				{
					instrumentId: instrument1,
					note: 'E4',
					velocity: 0,
					delay: 13.75,
					duration: 3,					
					shouldFade: true,
					fadeDuration: 0.5					
				},
				{
					instrumentId: instrument1,
					note: 'G4',
					velocity: 0,
					delay: 13.75,
					duration: 3,					
					shouldFade: true,
					fadeDuration: 0.5					
				}
			]
		}

		dispatch(playSequence(payload));
	};

	return (
		<Container maxWidth="lg">
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					StepTunes v1
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
