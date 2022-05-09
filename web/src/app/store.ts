import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { logger } from "redux-logger";
import mainDrawerSlice from "../slices/mainDrawerSlice";
import drawSlice from "../slices/drawSlice";
import midiPlayerSlice from "../slices/midiPlayerSlice";

export const store = configureStore({
	reducer: {
		drawer: mainDrawerSlice,
		draw: drawSlice,
		midi: midiPlayerSlice
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActionPaths: ["payload.phaser", "payload.loadCallback"],
				ignoredPaths: ["draw.phaser"],
			}
		}).concat(logger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
