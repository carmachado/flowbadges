const dayjs = require("dayjs");
const firebase = require("firebase/app");

require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "flow-badges.firebaseapp.com",
  projectId: "flow-badges",
  storageBucket: "flow-badges.appspot.com",
  messagingSenderId: "117814287672",
  appId: process.env.APP_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const getFrases = async () => {
  const snapshotFrases = await db.collection("frases").get();
  const frases = [];
  snapshotFrases.forEach((doc) => frases.push(doc.data().description));
  return frases;
};

const getBadges = async () => {
  const snapshotBadges = await db.collection("badges").get();
  const postedBadges = {};
  snapshotBadges.forEach((doc) => {
    postedBadges[doc.id] = doc.data();
  });
  return { postedBadges, onGoingBadge: {} };
};

const deleteOldBadges = async () => {
  const querySnapshot = await db
    .collection("badges")
    .where("expires_at", "<", dayjs().tz().format())
    .get();
  querySnapshot.forEach((doc) => doc.ref.delete());
};

const saveBadge = async (badge) => {
  return db.collection("badges").doc(badge.code).set(badge);
};

const getUsers = async () => {
  const snapshotUsers = await db.collection("users").get();
  const users = [];
  snapshotUsers.forEach((doc) => users.push(doc.data().name));
  return users;
};

const getCreators = async () => {
  const snapshotCreators = await db.collection("creators").get();
  const creators = {};
  snapshotCreators.forEach((doc) => {
    creators[doc.id] = doc.data();
  });
  return creators;
};

module.exports = {
  getFrases,
  getBadges,
  getUsers,
  saveBadge,
  deleteOldBadges,
  getCreators,
};
