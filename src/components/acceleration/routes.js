const { Router } = require("express");
const router = Router();
const {
  createModelIA,
  getDataIA,
  convertTensorIA,
  trainModelIA,
  generateModelIA,
  deleteModelIA,
} = require("./controller");

router.get("/", createModelIA, generateModelIA);

router.get("/delete", deleteModelIA);
// router.get("/create",createModelIA);
// router.get("/generate",generateModelIA);
// router.get("/", (req, res, next) => {
//     console.log("hello")
// })
module.exports = router;
