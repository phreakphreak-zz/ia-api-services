const { Schema, model } = require("mongoose");

const accelerometerSchema = new Schema(
  {
    model: {
      type: Buffer,
    },
    weights: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = model("Acceleromter",accelerometerSchema);