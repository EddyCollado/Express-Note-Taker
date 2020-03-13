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

//empty array for notesData
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
       notesData = fs.readFileSync("./db/db.json", "utf8");
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

//writes newly created notes to json file
app.post("/api/notes", function(req,res) {
     try {
       //reads json file
       notesData = fs.readFileSync("./db/db.json", "utf8");
       console.log(notesData);
       
       notesData = JSON.parse(notesData);
       // set new notes id
       req.body.id = notesData.length;
       //add new note to array of objects
       notesData.push(req.body);
       // make it a string so you can write it to the file
       notesData = JSON.stringify(notesData);
       // writes new note to file
       fs.writeFile("./db/db.json", notesData, "utf8", err => {
           if (err) throw err;
       });

       res.json(JSON.parse(notesData));
     } catch (err) {
         throw err;
         console.log(err);
     }
 });

//DELETE portion

app.delete("/api/notes/:id", function(req,res) {
    try {
        // reads json file
        notesData = fs.readFileSync("./db/db.json", "utf8");
        
        notesData = JSON.parse(notesData);
        //delete old notes from array 
        notesData = notesData.filter(note => {
            return note.id != req.params.id;
        });

        notesData = JSON.stringify(notesData);

        //write new current notes to file
        fs.writeFile("./db/db.json", notesData, "utf8", err => {
            if (err) throw err;
        });
        res.send(JSON.parse(notesData));
    } catch (err) {
        throw err;
        console.log(err);
    }
});


 //HTML GET requests

app.get("/notes", req, res => {
     res.sendFile(path.join(__dirname, "public/notes.html"));
});
// if no matching route is found, default to home
app.get("*", req, res => {
   res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", req, res => {
   res.sendFile(path.join(__dirname, "db/db.json"));
});
//port listener

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
  });

