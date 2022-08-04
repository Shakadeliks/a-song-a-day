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
export const getAllGenres = async () => {
    const {genres: [...genres]} = await spotifyApi.clientCredentialsGrant().then(
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
        const genres = await getGenres();
        return genres;
    }) 
    return genres;
}