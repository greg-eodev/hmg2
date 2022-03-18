import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import mainDrawerSlice from "../slices/mainDrawerSlice";
import drawSlice from "../slices/drawSlice";

export const store = configureStore({
	reducer: {
		drawer: mainDrawerSlice,
		draw: drawSlice
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActionPaths: ['payload.phaser'],
				ignoredPaths: ['draw.phaser'],
			}
		})
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
