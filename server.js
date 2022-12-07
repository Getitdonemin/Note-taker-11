//Note taker's server.js
// To begin we're going to need these dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")


//Set Express App
var app = express();
var PORT = process.env.PORT || 3000;

// this allows to link to public
app.use(express.static('public'));


// This sets up data parsing-- Express will interpret it/format data as JSON.
// This is required for API calls!

//Setting up data parsing which express will format is as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Calling APIs


//First gets it from index.html then listens

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Note's + URL
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// Making the GET, POST, and DELETE API EndpointsGET

// Making Get and POST since they are both coming from the same server
app.route("/api/notes")
    // Grabs and updates from note lists
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // Making test for it to take its original note
        let highestId = 99;
        // Loop for Highest ID
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // Making the highest id to be the highest priority into the notesArray 
                highestId = individualNote.id;
            }
        }
        // assigning an id to newNote
        newNote.id = highestId + 1;
        // then pushing it into db.json
        database.push(newNote)

        // db json file
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Notes Saved");
        });
        // Lastly taking the response to User's new note
        res.json(newNote);
    });

    // Making delete api endpoint
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // requesting to delete through id
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            // with splice we take the i varaible position which then deletes the note
            database.splice(i, 1);
            break;
        }
    }
    // db.json file
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Notes deleted");
        }
    });
    res.json(database);
});

//server set up
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});