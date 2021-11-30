const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const isStreamLive = async (userName) => {
  const user = await apiClient.helix.users.getUserByName(userName);
  if (!user) {
    return false;
  }
  return (await apiClient.helix.streams.getStreamByUserId(user.id)) !== null;
};

module.exports = { isStreamLive };
