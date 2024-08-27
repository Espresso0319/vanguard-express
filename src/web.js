const Hafiz = require("hafiz").load(__dirname);

const port = process.env.PORT || 3000;

const Orthanc = require("./isenguard/orthanc")({
  core: Hafiz("core"),
  security: Hafiz("security"),
});

Orthanc.ready(() => {
  Orthanc.log.info("Orthanc up and ready!");

  /* Application level middleware */
  Orthanc.use("./middleware");

  Orthanc.use("./isenguard/ig-auth", Hafiz("auth"));

  /* Listen to designated port */
  Orthanc.ready(() => {
    const server = Orthanc.app.listen(port, () => {
      Orthanc.log.info(`Vanguard ready and listening on port ${port}`);
      Orthanc.endpoint(require("./api/webHealth"));
    });

    server.keepAliveTimeout = Hafiz("core.server.keepAliveTimeout");
  });
});
