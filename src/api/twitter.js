const Twitter = require("twitter");
const download = require("download");
const path = require("path");
const fs = require("fs");

const { badgeToString } = require("../model/badges");
const logConsole = require("../utils/logConsole");

const twitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const postBadge = async (badge, frases, creators) => {
  try {
    const status = badgeToString(badge, frases, creators);

    const tweet = await postTweet({ status });

    await new Promise((r) => setTimeout(r, 1000));

    await postTweet({
      status: `${badge.code}`,
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true,
    });

    return tweet;
  } catch (error) {
    logConsole("error", { message: JSON.stringify(error) });
  }
};

const postTweet = async (tweet) => {
  return twitterClient.post("statuses/update", tweet);
};

const getMediaInformation = async (url) => {
  const urlObject = new URL(url);
  const pathnames = urlObject.pathname.split("/");

  const filename = pathnames[pathnames.length - 1];
  const filePath = path.join(".", "dist", filename);

  await download(url, "dist", { filename: filename });

  const mediaData = fs.readFileSync(filePath);
  const mediaSize = fs.statSync(filePath).size;
  const mediaType = `image/${filename.split(".").pop()}`;

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return { mediaData, mediaSize, mediaType };
};

const uploadMedia = async (url) => {
  try {
    const { mediaData, mediaType, mediaSize } = await getMediaInformation(url);

    const { media_id_string: mediaId } = await twitterClient.post(
      "media/upload",
      {
        command: "INIT",
        total_bytes: mediaSize,
        media_type: mediaType,
      }
    );

    await twitterClient.post("media/upload", {
      command: "APPEND",
      media_id: mediaId,
      media: mediaData,
      segment_index: 0,
    });

    await twitterClient.post("media/upload", {
      command: "FINALIZE",
      media_id: mediaId,
    });

    return mediaId;
  } catch (error) {
    logConsole("error", { message: error.message });
    return undefined;
  }
};

module.exports = { postBadge, uploadMedia };
