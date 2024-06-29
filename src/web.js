const Hafiz = require("hafiz").load(__dirname);

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const Orthanc = require("./isenguard/orthanc")({
  core: Hafiz("core"),
  security: Hafiz("security"),
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Vanguard ready and listening on port ${port}`);
});
