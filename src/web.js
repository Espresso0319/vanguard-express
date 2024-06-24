const Hafiz = require("hafiz").load(__dirname);

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Vanguard ready and listening on port ${port}`);
});