const {Router} = require("express");
const router = Router();
const acceleration = require("../components/acceleration/routes");

router.use("/acceleration",acceleration);

module.exports = router;