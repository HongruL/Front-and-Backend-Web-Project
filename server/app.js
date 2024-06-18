import http from "http";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.server = http.createServer(app);
// Enable CORS
app.use(cors());

// Adding a default route at /
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Route to serve niederschlag data
app.get("/wetterdaten/niederschlag", (req, res) => {
  const filePath = path.join("server", "niederschlag_monat.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

// Route to serve temperatur data
app.get("/wetterdaten/temperatur", (req, res) => {
  const filePath = path.join("server", "temperatur_drei_mal_taeglich.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.server.listen(3000, () => {
  console.log(`Started on port ${app.server.address().port}`);
});