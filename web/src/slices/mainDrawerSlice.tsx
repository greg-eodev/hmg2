import { createSlice } from "@reduxjs/toolkit"

interface IDrawerState {
	isVisible: boolean
}

const initialState: IDrawerState = {
	isVisible: false
}

const mainDrawerSlice = createSlice({
	name: "drawer",
	initialState,
	reducers: {
		openDrawer: (state) => {
			state.isVisible = true;
		},
		closeDrawer: (state) => {
			state.isVisible = false;
		}
	}
});

export const { openDrawer, closeDrawer } = mainDrawerSlice.actions;

export default mainDrawerSlice.reducer;