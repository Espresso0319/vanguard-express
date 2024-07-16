const promise = require("bluebird");
const redis = require("redis");
const Redlock = require("redlock");
const slackConfig = require("./config/slack");

/* promise.promisifyAll(redis); */
promise.promisifyAll(redis.RedisClient.prototype);

module.exports = (options) =>
  /* Initialize Redis */
  async function init() {
    /**
     * Do not proceed if test$ flag is set
     */
    if (options.test$) {
      this.log.info("Test mode enabled, skipping Redis connection");

      return;
    }

    const native = this.get("db").collection("redis");

    /* Create redis instance */
    const redisClient = redis.createClient(options.uri, {
      no_ready_check: true,
    });

    /* Callback on success */
    redisClient.on("ready", () => {
      /* Log successful connection */
      console.log("redis connection successful");

      /* Flush all keys on successful connection */

      /* redisClient.flushall(); */

      /* Clear mongodb redis collection  */
      /* native.deleteMany({}); */
    });

    /* Callback on failure */
    redisClient.on("error", async (error) => {
      /* Panic */
      const { redisChannel, tagPeople } = slackConfig;

      console.log("redis connection error", error);

      /* if connection failed , send to slack */
      await this.actAsync("ns:slack,cmd:send", {
        message: error.message,
        tagPeople,
        channel: redisChannel,
      });

      /* sentry */
      this.captureError(error);
    });

    redisClient.on("reconnecting", () => {
      /* Panic */
      console.log("redis reconnecting");
    });

    /**
     * redis lock
     * The default retryDelay is 200ms, we set the retryCount as 15,
     *  so it will throw error when the progress can't acquire the lock after 3 seconds
     */
    const redlock = new Redlock([redisClient], { retryCount: 15 }); // Configuration ==> https://github.com/mike-marcacci/node-redlock#configuration

    /* Bind redis client */
    this.set("redis", redisClient);
    this.set("redlock", redlock);
    this.set("redisUrl", options.uri);
    this.set("redisTimeout", options.timeout);
  };
