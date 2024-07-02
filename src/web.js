const Hafiz = require("hafiz").load(__dirname);

const port = process.env.PORT || 3001;

const Orthanc = require("./isenguard/orthanc")({
  core: Hafiz("core"),
  security: Hafiz("security"),
});

Orthanc.ready(() => {
  Orthanc.log.info("Orthanc up and ready!");

  /* Application level middleware */
  Orthanc.use("./middleware");

  /* Listen to designated port */
  Orthanc.ready(() => {
    const server = Orthanc.app.listen(port, () => {
      Orthanc.log.info(`Vanguard ready and listening on port ${port}`);
    });

    server.keepAliveTimeout = Hafiz("core.server.keepAliveTimeout");
  });
});
