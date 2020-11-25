const express = require("express");
const app = express();
const cors = require("cors");
const { upload, morgan, error404 } = require("./middlewares");

//settings
app.set("port", process.env.PORT || 3000);

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes


app.post(
  "/upload",
  upload.fields([
    {
      name: "model",
      maxCount: 1,
    },
    {
      name: "weights",
      maxCount: 1,
    },
  ]),
  async (req, res, next) => {
    console.log(req.body.title);
    res.json("ok");
  }
);

app.use("/api",require("./routes/index"));

//static
app.use('/static', express.static(__dirname + '/public'));

//error handler
app.use(error404);



module.exports = app;
