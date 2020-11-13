const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(process.cwd(), "/src/public/uploads"));
  },
  filename: function (req, file, callback) {
    console.log(file);
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const error404 = (req, res, next) => {
  res.status(404);

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  res.end();
};

const error500 = (req, res, next) => {
  res.status(500);

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Error internal" });
    return;
  }

  res.end();
};

module.exports.upload = upload;
module.exports.morgan = morgan;
module.exports.error404 = error404;
module.exports.error500 = error500;
