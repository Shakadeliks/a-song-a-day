import express from 'express';
import hbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { searchSongByGenre } from '../utilities/searchSongByGenre.js';
import { getSongOfTheDay } from '../utilities/getSongOfTheDay.js';
import { getAllGenres } from '../utilities/getAllGenres.js';
import { getRandomSongByAnyGenre } from '../utilities/searchSongByGenre.js';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicStaticFilesDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const databaseUrl = process.env.MONGODB_URL || `mongodb+srv://${encodeURIComponent(process.env.MONGO_DB_USER)}:${encodeURIComponent(process.env.MONGO_DB_PASSWORD)}@songs.mjkohuw.mongodb.net/?retryWrites=true&w=majority`



app.use(express.static(publicStaticFilesDirPath));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: "index",
    partialsDir: ['templates/views/partials']
}))
app.set('views', viewsPath);

app.get('/search', async (req, res) => {
    const genres = await getAllGenres();
    const genresToDisplay = ["any genre", ...genres];
    res.render('search', {
        genres: genresToDisplay
    })
})
app.get('/', async (req, res) => {
    const song = await getSongOfTheDay();
    res.render('home', {
        coverArt: song.coverArt,
        preview: song.preview_url,
        songName: song.songName,
        artistName: song.artistName,
        date: new Date().toDateString(),
    });
})
app.get('/searchsong', async (req, res) => {
    const genre = req.query.genre;
    let song;
    (genre == 'any genre')
        ? (song = await getRandomSongByAnyGenre())
        : (song = await searchSongByGenre(genre));
    res.render('searchsong', { 
        genre: genre,
        coverArt: song.coverArt,
        preview: song.preview,
        songName: song.songName,
        artistName: song.artistName,
     });
})
app.get("*", (req, res) => {
    res.render('404')
})

app.listen(port, () => console.log(`server is at port: ${port}`));

mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("db connected"))
    .catch((error) => console.log(error)); 
