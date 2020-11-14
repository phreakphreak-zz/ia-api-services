const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
      model:{
          type:JSON
      }
  },
  {
    timestamps: true,
  }
);


module.exports = model("model", schema);