require("dotenv").config();
const app = require("./app");
require("./services/database/index");



async function main() {
  await app.listen(app.get("port"));
  console.log("server on port",app.get("port"));
}

main();