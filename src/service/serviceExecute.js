const firebase = require("../api/firebase");
const serviceBadges = require("./serviceBadges");
const { isStreamLive } = require("../api/twitch");

const serviceExecute = async () => {
  firebase.deleteOldBadges();

  let cont = 0;
  while (true) {
    const flowLive = await isStreamLive("flowpodcast");

    if (flowLive || cont % 6 === 0) serviceBadges();

    if (flowLive) cont = 0;
    else cont++;

    await new Promise((r) => setTimeout(r, 10 * 60 * 1000));
  }
};

module.exports = serviceExecute;
