const express = require("express");
const path = require("path");

require("dotenv").config();

var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

const serviceExecute = require("./src/service/serviceExecute");
require("./src/api/firebase");

const PORT = process.env.PORT || 5000;

if (!process.env.NO_EXECUTION) serviceExecute();

express()
  .use("/public", express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
