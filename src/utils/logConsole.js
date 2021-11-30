const dayjs = require("dayjs");

const logConsole = (type, { executions = 0, total = 0, message = "" }) => {
  const date = dayjs().tz().format("YYYY/MM/DD HH:mm");

  const line = message || `badges: ${executions}/${total}`;

  console.log(`[${type.toUpperCase()}] ${date} - ` + line);
};

module.exports = logConsole;
