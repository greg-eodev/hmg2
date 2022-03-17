import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mainDrawerSlice from "../slices/mainDrawerSlice";

export const store = configureStore({
  reducer: {
	  drawer: mainDrawerSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
