const firebase = require("../api/firebase");
const flow = require("../api/flow");
const { postBadge } = require("../api/twitter");
const { resetAndSaveBadges, getBadges } = require("../model/badges");
const logConsole = require("../utils/logConsole");

const serviceBadges = async () => {
  try {
    const [allBadges, frases, creators] = await Promise.all([
      getBadges(),
      firebase.getFrases(),
      firebase.getCreators(),
    ]);

    const onGoingBadge = Object.entries(allBadges.onGoingBadge);

    if (process.env.NO_PUPLISH) {
      console.log(allBadges.onGoingBadge);
      return;
    }

    const twitterReq = onGoingBadge.map(([code, badge]) => {
      return postBadge(badge, frases, creators);
    });

    await Promise.all(twitterReq);

    onGoingBadge.map(([code, badge]) => {
      flow.setBadge(code);
    });

    resetAndSaveBadges(allBadges);

    logConsole("exe", {
      executions: onGoingBadge.length,
      total: Object.keys(allBadges.badges).length,
    });

    return twitterReq?.length;
  } catch (error) {
    logConsole("error", { message: error.message });
  }
  return 0;
};

module.exports = serviceBadges;
