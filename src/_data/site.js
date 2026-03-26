const fs = require("fs");
const path = require("path");

module.exports = function () {
  const siteJsonPath = path.join(__dirname, "..", "content", "site.json");
  return JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));
};
