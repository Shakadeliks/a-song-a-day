
# A Song a Day

A website for music lovers and listeners hungry for new sounds. A new song is recommended every day and users can try their luck with random song search based on any genre.

## Tech Stack

- Nodejs
- Expressjs
- Express-handlebars
- MongoDB
- TailwindCSS
- Spotify-web-api-node
## Features

Access to the spotify API data, allowing for random recommendations from a pool of millions of songs.
A "song of the day" is set and recommended and changed every day.

Users can get as many random song recommendations from either a specific or any genre, with over 100 to choose from.

Most of the songs come with a 30 second preview, so users can get a taste of the relevant song.

## Screenshots

![Screen Shot 2022-08-06 at 21 55 49](https://user-images.githubusercontent.com/80819894/183264789-1d6fd9e8-86f6-45ca-85b3-398a440704e3.png)
![Screen Shot 2022-08-06 at 21 55 19](https://user-images.githubusercontent.com/80819894/183264791-9a9f5dc0-0b2b-45ee-b502-51b46dfbdec5.png)
![Screen Shot 2022-08-06 at 21 54 51](https://user-images.githubusercontent.com/80819894/183264794-2ba6dda6-f7e3-424b-adef-4627384e99bb.png)


## Lessons Learned

This project provided a deeper understanding of the ins and outs of server-side rendering, as well as the performance benefits. Especially in terms of page rendering when fetching and displaying dynamic data.

The project required multiple get requests to be chained together to receive the necessary song data from the Spotify API. The returned data provided exposure to processing and destructuring large objects.

I was able to learn about the handlebars templating engine that dynamically and conditionally renders data passed to the templates via the server.




