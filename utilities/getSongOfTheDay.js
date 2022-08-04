import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';
dotenv.config();
import Song from '../Models/Song.js';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});
const getGenres = async () => {
    const genres = await spotifyApi.getAvailableGenreSeeds()
        .then(
            function (data) {
                const genres = data.body;
                return genres;
            }, 
            function (err) {
                console.log('something went wrong!', err);   
            }
        )
    return genres
}

const getRandomGenre = (genres) => {
    const randomGenre = genres[~~(Math.random() * genres.length)];
    return randomGenre;
}
const getRandomTracksByGenre = async (randomGenre) => {
    const tracksByGenre = await spotifyApi.searchTracks(`genre:${randomGenre}`)
        .then(function ({ body: { tracks: { items } } }) {
            return items;
        }, function (err) {
            console.log(err);
        });    
    return tracksByGenre;
}
const getRandomTrackId = async (trackSearchResults) => {
    const randomTrack = await trackSearchResults[~~(Math.random() * trackSearchResults.length)];
    const { id } = randomTrack;
    return id;
}
const getRandomTrack = async (trackId) => {
    const track = await spotifyApi.getTrack(trackId)
    .then(function (data) {
        return data.body;
    }, function (err) {
        console.log(err);
    });
    return track;
}
const getDates = (storedSong) => {
    let [{ createdAt }] = storedSong;
    createdAt = createdAt.toISOString().split('T');
    const currentDate = new Date().toISOString().split('T');
    const [dateSaved,] = createdAt;
    const [dateToday,] = currentDate;
    return [dateSaved, dateToday];
}
export const getSongOfTheDay = async () => {
    const storedSong = await Song.find().exec();
    const [dateSaved, dateToday] = getDates(storedSong);
    let newTrack;

    if (dateToday > dateSaved) {
        newTrack = await spotifyApi.clientCredentialsGrant().then(
            async function (data) {
                spotifyApi.setAccessToken(data.body['access_token'])
            },
            function (err) {
                console.log(
                    'Something went wrong when retrieving an access token', err.message
                );
            }
        ).then(async () => {
            const genres = await getGenres();
            return genres;
        }).then(async ({ genres }) => {
            const randomGenre = await getRandomGenre(genres);
            return randomGenre
        }).then(async (randomGenre) => {
            const randomTracks= await getRandomTracksByGenre(randomGenre);
            return randomTracks;
        }).then(async (randomTracks) => {
            const randomTrackId = await getRandomTrackId(randomTracks);
            return randomTrackId
        }).then(async (randomTrackId) => {
            const randomTrack = await getRandomTrack(randomTrackId);
            return randomTrack;
        })

        const { id } = newTrack;
        const songToDelete = storedSong[0];
        const deleteResult = await Song.deleteOne(songToDelete);
        if (deleteResult.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
        }
        const saveNewSongResult = await Song.create({
            songId: id,
        })
        console.log(saveNewSongResult);
    } else {
        const [{ songId }] = storedSong;
        newTrack = await spotifyApi.clientCredentialsGrant().then(
            async function (data) {
                spotifyApi.setAccessToken(data.body['access_token'])
            },
            function (err) {
                console.log(
                    'Something went wrong when retrieving an access token', err.message
                );
            }   
        ).then(async () => {
            const track = await getRandomTrack(songId);
            return track;            
        })
    }
    const song = {
        coverArt: newTrack.album.images[0].url,
        preview: newTrack.preview_url,
        songName: newTrack.name,
        artistName: newTrack.artists[0].name
    }
    return song;
}