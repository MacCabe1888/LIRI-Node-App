require("dotenv").config();

let axios = require("axios");

let moment = require("moment");

let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);

let fs = require("fs");

function concertThis(artist) {

    if (artist === "") {
        console.log();
        return console.log("Please include the name of the artist whose event info you'd like to see.");
    }

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function(response) {

            let events = response.data;

            if (events === "\n{warn=Not found}\n") {
                console.log();
                return console.log("Sorry, I couldn't find any artists by that name. Please make sure you've spelled the artist's name correctly.");
            } else if (events.length === 0) {
                console.log();
                return console.log("Sorry, I couldn't find any upcoming events for that artist.");
            } else {
                for (i = 0; i < events.length; i++) {

                    console.log();

                    let event = events[i];

                    console.log(event.venue.name);
                    if (event.venue.region === "") {
                        console.log(`${event.venue.city}, ${event.venue.country}`);
                    } else {
                        console.log(`${event.venue.city}, ${event.venue.region}, ${event.venue.country}`);
                    }
                    console.log(`${moment(event.datetime).format("MM/DD/YYYY")} at ${moment(event.datetime).format("LT")}`);

                }
            }

        }
    );

}

function spotifyThisSong(song) {

    if (song === "") {
        song = '"The Sign" - Ace of Base';
    }

    spotify.search({ type: "track", query: song }, function(err, data) {

        console.log();

        if (err) {
            return console.log("Error occurred: " + err);
        } else {

            let info = data.tracks.items[0];

            console.log(`Title: "${info.name}"`);

            let artists = [];
            for (i = 0; i < info.artists.length; i++) {
                artists.push(info.artists[i].name);
            }
            console.log(`Artist(s): ${artists.join(", ")}`);

            console.log(`Album: ${info.album.name}`);

            console.log(`Preview: ${info.preview_url}`);

        }

    });

}

function movieThis(movie) {

    if (movie === "") {
        movie = "Mr. Nobody";
    }

    let queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryURL).then(
        function(response) {

            console.log();

            let info = response.data;

            console.log(`Title: ${info.Title}`);
            console.log(`Year: ${info.Year}`);
            console.log(`Rated: ${info.Rated}`);
            console.log(`Director: ${info.Director}`);
            console.log(`Writer: ${info.Writer}`);
            console.log(`Actors: ${info.Actors}`);
            console.log(`Plot: ${info.Plot}`);
            console.log(`Language: ${info.Language}`);
            console.log(`Country: ${info.Country}`);
            console.log(`IMDb Rating: ${info.Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating: ${info.Ratings[1].Value}`);

        }
    );

}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        } else {
            data = data.split(",");
            let command = data[0];
            let nameArray = data[1].split(" ");
            let name = "";
            for (let i = 0; i < nameArray.length; i++) {
                if ((i > 0) && (i < nameArray.length)) {
                    name = name + "+" + nameArray[i];
                } else {
                    name += nameArray[i];
                }
            }
            name = name.replace(/"/g,"");
            liri(command, name);
        }
    });
}

function liri(command, name) {
    switch(command) {
        case undefined:
            console.log();
            console.log("Hi, I'm LIRI!* I can help you find information about concerts, songs, and movies! Please enter one of the following commands to begin:");
            console.log('node liri.js concert-this "[band/artist name]" | node liri.js spotify-this-song "[name of song &/or artist &/or album, etc.]" | node liri.js movie-this "[movie title]" | node liri.js do-what-it-says');
            console.log();
            console.log('* "Language Interpretation and Recognition Interface"');
            return;
        case "concert-this":
            concertThis(name);
            break;
        case "spotify-this-song":
            spotifyThisSong(name);
            break;
        case "movie-this":
            movieThis(name);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log();
            console.log("No valid command detected. Please try one of the following commands:");
            console.log('node liri.js concert-this "[band/artist name]" | node liri.js spotify-this-song "[name of song &/or artist &/or album, etc.]" | node liri.js movie-this "[movie title]" | node liri.js do-what-it-says');
    }
}

let command = process.argv[2];
let name = "";
for (let i = 3; i < process.argv.length; i++) {
    if ((i > 3) && (i < process.argv.length)) {
        name = name + "+" + process.argv[i];
    } else {
        name += process.argv[i];
    }
}

liri(command, name);