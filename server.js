// need express to connect with the frontend
const express = require("express");
// need path for filename paths
const path = require("path");
// need fs to read and write to files
const fs = require("fs");

//starting the express server
const app = express();
//setting the PORT 
const PORT = process.env.PORT || 7007;

//empty array fro noteData
let notesData = [];

// Set up body parsing, static, and routing
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "./public")));

//routing portion

//api calls for GET, POST, and DELETE

app.get("/api/notes", function(err, res) {
    try {
       // reads the notes from json file
       notesData = fs.readFileSync("db/db.json", "utf8");
       console.log("Success! json file has been read");
       //parse data to turn nitesData into objects
       notesData = JSON.parse(notesData);
   
      // err handling 
    } catch (err) {
       console.log("\n error (in app.get.catch):");
       console.log(err);
    }
    // send objects to browser
    res.json(notesData);
});


//port listener

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
  });

