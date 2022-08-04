import dotenv from "dotenv";

export const constants = {
    sptfy: {
        BASE_URL: "https://accounts.spotify.com/api/token",
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    }
}

