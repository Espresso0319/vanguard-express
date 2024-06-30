const Hafiz = require("hafiz").load(__dirname);

const port = process.env.PORT || 3001;

const Orthanc = require("./isenguard/orthanc")({
  core: Hafiz("core"),
  security: Hafiz("security"),
});

Orthanc.ready(() => {
  console.log("Orthanc up and ready!");
});
