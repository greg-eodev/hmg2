import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const soundFontSlice = createApi({
	reducerPath: "soundfont",
	baseQuery: fetchBaseQuery({ baseUrl: "https://sounds.steptunes.com" }),
	endpoints: builder => ({
		loadSound: builder.query({
			query: (soundId) => ({
				url: `/${soundId}`,
				method: "GET",
				headers: {
					"Content-Type": "application/javascript",
					"Access-Control-Allow-Origin": "*"
				},
				mode: "no-cors"
			})
		})
	})
});

export const { useLoadSoundQuery } = soundFontSlice;
