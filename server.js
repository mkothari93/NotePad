const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    fs.readFile(`./db/db.json`, "utf-8", (error, data) => {
      if (error) {
        console.log(error);
      } else {
        const dbNote = JSON.parse(data);
        dbNote.push({ title, text, id: uuid.v4() });
        fs.writeFile(`./db/db.json`, JSON.stringify(dbNote), (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Note has been added.");
          }
        });
      }
    });
    res.json({ status: "Success", body: { title, text, id: uuid.v4() } });
  } else {
    res.json("Error: note cannot be added.");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(`./db/db.json`, 'utf-8', (error, data) => {
    if (error) { console.log(error); }
    const dbNote = JSON.parse(data);
    for (let i=0; i < dbNote.length; i++) {
      if (dbNote[i].id === req.params.id) { dbNote.splice(i, 1); } 
    }
    fs.writeFile(`./db/db.json`, JSON.stringify(dbNote), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Note has been deleted.");
      }
    })
    
  })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
