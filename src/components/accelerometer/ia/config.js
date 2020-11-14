module.exports = {
  compiler: {
    optimizer: "sgd",
    loss: "meanSquaredError",
    metrics: ["mse"],
  },
  modelFitArgs: {
    batchSize: 32,
    epochs: 50,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, log) => {
        console.log(`Epoch ${epoch}: loss = ${log.loss}`);
      },
    },
  },
  URI: "",
  nn: [3, 6, 12, 6, 3, 1],
};
