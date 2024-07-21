/**
 * scheduler/schedule.js
 */
const Cron = require("cron").CronJob;
const Bluebird = require("bluebird");
const _ = require("lodash");

/**
 * scheduler decorator
 */
function schedule(cron, tz, task, ...args) {
  /* Get Scheduler configuration */
  const options = this.get("scheduler.options");

  /**
   * Allow omission of {tz} argument
   */
  if (!tz) {
    tz = options.timezone;
  }

  /**
   * Determine the task name
   */
  const name = typeof task === "string" ? task : task.name;

  /**
   * Log addition
   */
  this.log.info("scheduler-add", name, cron, tz);

  /**
   * Wrap task into a function and make sure we capture
   * any potential errors
   */
  const fn = async () => {
    /* Log scheduler */
    this.log.info("scheduler-run", name);

    /* Create promise for scheduler */
    const promise =
      typeof task === "string"
        ? this.actAsync(task, ...args)
        : Bluebird.try(() => task.call(this, ...args));

    const startAt = new Date();
    let status;

    return promise
      .then(async () => {
        status = "success";
      })
      .catch((err) => {
        status = "failed";

        const endAt = new Date();

        this.captureError(
          _.assign(err, {
            name,
            startAt,
            endAt,
            duration: (endAt - startAt) / 1000,
            args: { ...args }["0"],
          })
        );
      })
      .finally(async () => {
        const endAt = new Date();

        await this.actAsync("ns:util,role:data,cmd:upsert", {
          id: "cronTimeStamp",
          value: +new Date(),
        });
      });
  };

  /**
   * Create a Cron job and return it
   */
  return new Cron(cron, fn, null, true, tz);
}

module.exports = schedule;
