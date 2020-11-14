const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const axios = require("axios").default;


/**
 *
 * @returns {*} model
 */
async function createModel(nn) {
  const model = tf.sequential();

  //1st layer 6
  model.add(
    tf.layers.dense({
      units: nn[1],
      activation: "relu",
      inputShape: [nn[0]],
      useBias: true,
    })
  );

  //2nd layer 12
  model.add(
    tf.layers.dense({
      units: nn[2],
      activation: "relu",
      inputShape: [nn[1]],
      useBias: true,
    })
  );

  //3rd layer 6
  model.add(
    tf.layers.dense({
      units: nn[3],
      activation: "relu",
      inputShape: [nn[2]],
      useBias: true,
    })
  );

  //4th layer 3
  model.add(
    tf.layers.dense({
      units: nn[4],
      activation: "relu",
      inputShape: [nn[3]],
      useBias: true,
    })
  );

  //5th layer 1 OUTPUT
  model.add(
    tf.layers.dense({
      units: nn[5],
      activation: "sigmoid",
      useBias: true,
    })
  );

  return model;
}

/**
 * @returns {*} dataCleaned
 */
async function getData(URI) {
  const response = await axios.get(URI);

  //   let responseOK =
  //     response && response.status === 200 && response.statusText === "OK";

  const data = await response.data;
  const dataCleaned = data
    .map((car) => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter((car) => car.mpg != null && car.horsepower != null);

  return dataCleaned;
}

/**
 *
 * @param {*} data
 */
async function convertTensor(data) {
  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.horsepower);
    const labels = data.map((d) => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

/**
 *
 * @param {*} model
 * @param {*} inputs
 * @param {*} labels
 */
async function trainModel(model, inputs, labels,compiler, modelFitArgs) {
  model.compile(compiler);
  return await model.fit(inputs, labels, { modelFitArgs });
}



module.exports = {
  convertTensor,
  getData,
  createModel,
  trainModel
};
