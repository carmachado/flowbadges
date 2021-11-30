const fetch = require("node-fetch");

const logConsole = require("../utils/logConsole");
const xmlhttprequest = require("xmlhttprequest");

const setBadge = async (badge) => {
  try {
    const headers = {
      referer: "https://flowpodcast.com.br/",
      accept: "*/*",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": '"Chromium";v="90", "Opera";v="76", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-client-version": "Opera/JsCore/7.15.0/FirebaseCore-web",
    };

    const { id_token } = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.FLOW_KEY}`,
      {
        headers,
        body: `grant_type=refresh_token&refresh_token=${process.env.FLOW_REFRESH_TOKEN}`,
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    ).then((res) => res.json());

    var xhr = new xmlhttprequest.XMLHttpRequest();

    xhr.open(
      "POST",
      "https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/badges/redeem",
      true
    );

    xhr.setRequestHeader("accept", "application/json, text/plain, */*");
    xhr.setRequestHeader(
      "accept-language",
      "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6"
    );
    xhr.setRequestHeader("authorization", `Bearer ${id_token}`);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(
      "sec-ch-ua",
      '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"'
    );
    xhr.setRequestHeader("sec-ch-ua-mobile", "?0");
    xhr.setRequestHeader("sec-fetch-dest", "empty");
    xhr.setRequestHeader("sec-fetch-mode", "cors");
    xhr.setRequestHeader("sec-fetch-site", "cross-site");

    xhr.send(`{"email":"${process.env.FLOW_EMAIL}","code":"${badge}"}`);

    xhr.onreadystatechange = function () {
      logConsole("flow", {
        message: JSON.parse(this.responseText).status.message,
      });
    };
  } catch (error) {
    logConsole("error", { message: error.message });
  }
};

module.exports = { setBadge };
