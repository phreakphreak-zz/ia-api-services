const mongoose = require("mongoose");
const {
  MONGODB_DRIVER,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_CLUSTER,
  MONGODB_DBNAME,
} = require("../../config/development");
const URI = `${MONGODB_DRIVER}://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_CLUSTER}/${MONGODB_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB is connected");
});
