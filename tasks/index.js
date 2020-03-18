const schedule = require("node-schedule");

const {
  morningMeme,
  clearUsersRequestedMeme
} = require("../services/memeService");
const {
  incrementAllUserCurrency,
  updateStock,
  resetHasFoughtFlags
} = require("../services/robotService");

module.exports = client => {
  // Post a meme to the channel at 8.30 every morning
  const meme = schedule.scheduleJob("30 8 * * *", function() {
    console.info(`morningMeme will next run at ${meme.nextInvocation()}`);
    morningMeme(client);
  });

  // Clear the usersRequestedMeme record daily at 1am - only two memes per day
  const clearMemeRecords = schedule.scheduleJob("* 1 * * *", async function() {
    try {
      await clearUsersRequestedMeme();
    } catch (error) {
      console.error("Error clearing user meme requested: ", error);
    }
  });

  // Increment all users currency by 10 every hour
  const handOutGold = schedule.scheduleJob("1 * * * *", async function() {
    try {
      await incrementAllUserCurrency();
    } catch (error) {
      console.error("Error incrementing currency: ", error);
    }
  });

  const refreshStore = schedule.scheduleJob("* 3 * * *", async function() {
    try {
      await updateStock();
    } catch (error) {
      console.error("Error updating stock: ", error);
    }
  });

  const resetFights = schedule.scheduleJob("* 2 * * *", async function() {
    try {
      await resetHasFoughtFlags();
    } catch (error) {
      console.error("Error reset current hp: ", error);
    }
  });

  console.info(
    `the first resetFights will run at ${resetFights.nextInvocation()}`
  );
  console.info(
    `the first refreshStore will run at ${refreshStore.nextInvocation()}`
  );
  console.info(
    `the first handOutGold will run at ${handOutGold.nextInvocation()}`
  );
  console.info(`the first morningMeme will run at ${meme.nextInvocation()}`);
  console.info(
    `the first clearMemeRecords will run at ${clearMemeRecords.nextInvocation()}`
  );
};
