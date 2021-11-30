const fetch = require("node-fetch");
const dayjs = require("dayjs");

firebase = require("../api/firebase");

const getBadges = async () => {
  const [allBadges, users] = await Promise.all([
    firebase.getBadges(),
    firebase.getUsers(),
  ]);

  const promises = users.map((user) =>
    fetch(
      `https://flow3r-api-master-2eqj3fl3la-ue.a.run.app/v2/user/badges/${user}`
    )
      .then((value) => value.json())
      .then((value) => ({ ...value, user }))
  );

  jsons = await Promise.all(promises);

  jsons.forEach(({ badges, user }) => {
    badges.forEach(({ code, src, expires_at, starts_on }) => {
      if (
        code &&
        !allBadges.postedBadges[code] &&
        !allBadges.onGoingBadge[code] &&
        new Date(expires_at) > new Date() &&
        (!starts_on || new Date(starts_on) <= new Date())
      ) {
        allBadges.onGoingBadge[code] = { src, expires_at, code, user };
      }
    });
  });

  allBadges.badges = { ...allBadges.onGoingBadge, ...allBadges.postedBadges };

  return allBadges;
};

const resetAndSaveBadges = async (allBadges) => {
  const entries = Object.entries(allBadges.onGoingBadge);
  const promises = entries.map(([code, badge]) => firebase.saveBadge(badge));

  await Promise.all(promises);
};

const srcToCreator = (src, creators) => {
  const regex = /\/criador\/([\w]*)/g;
  const exec = regex.exec(src);

  const id = exec?.length > 1 && exec[1];
  return id && creators[id]?.name ? creators[id].name : "flow";
};

const badgeToString = (badge, frases, creators) => {
  const random = Math.floor(Math.random() * frases.length);

  const creator = srcToCreator(badge.src, creators);

  const expire = badge.expires_at
    ? `\nDisponível até ${dayjs(badge.expires_at)
        .tz()
        .format("DD/MM/YYYY HH:mm")}`
    : "";

  const secret = badge?.src?.toLowerCase()?.includes("secreto.")
    ? " secreto"
    : "";

  let status = frases[random];
  status += `\nEmblema${secret} do ${creator}: ${badge.code}`;
  status += expire;

  return status;
};

module.exports = { getBadges, resetAndSaveBadges, badgeToString };
