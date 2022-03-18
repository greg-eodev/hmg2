import { createSlice, PayloadAction  } from "@reduxjs/toolkit"

interface IDrawState {
	isVisible: boolean,
	phaser: any
}

const initialState: IDrawState = {
	isVisible: false,
	phaser: undefined
}

const mainDrawSlice = createSlice({
	name: "draw",
	initialState,
	reducers: {
		setCanvas: (state) => {
			state.isVisible = true;
		},
		setPhaser: (state, action: PayloadAction<any>) => {
			state.phaser = action.payload
		}
	}
});

export const { setCanvas, setPhaser } = mainDrawSlice.actions;

export default mainDrawSlice.reducer;
