import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';
dotenv.config();

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

    console.log()
    return track;
}

export const searchSongByGenre = async (genre) => {

    const songSearchResult = await spotifyApi.clientCredentialsGrant().then(
        async function (data) {
            console.log(`access token expires in ${data.body['expires_in']}`);
            console.log(`access token is ${data.body['access_token']}`);
            spotifyApi.setAccessToken(data.body['access_token'])
        },
        function (err) {
            console.log(
                'Something went wrong when retrieving an access token', err.message
            );
        }
    ).then(async () => {
        const randomTracks = await getRandomTracksByGenre(genre);
        return randomTracks;
    }).then(async (randomTracks) => {
        const randomTrackId = await getRandomTrackId(randomTracks);
        return randomTrackId;
    }).then(async (randomTrackId) => {
        const trackId = await getRandomTrack(randomTrackId);
        return trackId;
    })
    const songData = {
        preview: songSearchResult.preview_url,
        duration: songSearchResult.duration_ms,
        artistName: songSearchResult.artists[0].name,
        songName: songSearchResult.name,
        coverArt: songSearchResult.album.images[0].url,
    }
    return songData;
}
export const getRandomSongByAnyGenre = async () => {
    const songResult = await spotifyApi.clientCredentialsGrant().then(
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
        const randomTracks = await getRandomTracksByGenre(randomGenre);
        return randomTracks;
    }).then(async (randomTracks) => {
        const randomTrackId = await getRandomTrackId(randomTracks);
        return randomTrackId
    }).then(async (randomTrackId) => {
        const randomTrack = await getRandomTrack(randomTrackId);
        return randomTrack;
    })
    const song = {
        coverArt: songResult.album.images[0].url,
        preview: songResult.preview_url,
        songName: songResult.name,
        artistName: songResult.artists[0].name
    }
    return song;
}
