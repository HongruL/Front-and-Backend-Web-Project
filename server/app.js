import http from "http";
import express from "express";

const app = express();
app.server = http.createServer(app);

// Adding a default route at /
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.server.listen(3000, () => {
  console.log(`Started on port ${app.server.address().port}`);
});
