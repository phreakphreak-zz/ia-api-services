const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {Array} neurons
 * @param {Array} inputShape
 * @param {String} activationInput
 * @param {String} activationOutput
 * @param {Boolean} bias
 * @return {Object} model
 * @phreakphreak
 */
async function createModel(
  neurons,
  inputShape,
  activationInput,
  activationOutput,
  bias
) {
  const model = tf.sequential();

  for (let i in neurons) {
    if (neurons[i] === neurons[neurons.length - 1]) {
      model.add(
        tf.layers.dense({
          units: neurons[i],
          activation: activationOutput,
          useBias: bias,
        })
      );
    } else {
      model.add(
        tf.layers.dense({
          units: neurons[i],
          activation: activationInput,
          inputShape: [inputShape[i]],
          useBias: bias,
        })
      );
    }
  }

  return model;
}

/**
 *
 * @param {String} url
 * @param {Function} mapStruct
 * @param {Function} filterStruct
 * @return {Object} cleaned
 * @phreakphreak
 */
async function getData(url, mapStruct, filterStruct) {
  const response = await axios.get(url);
  const data = await response.data;
  const cleaned = data.map(mapStruct).filter(filterStruct);

  // .map((car) => ({
  //   mpg: car.Miles_per_Gallon,
  //   horsepower: car.Horsepower,
  // }))
  // .filter((car) => car.mpg != null && car.horsepower != null);

  return cleaned;
}

/**
 *
 * @param {Object} data
 * @param {Function} mapX
 * @param {Function} mapY
 * @return {Object}
 * @phreakphreak
 * {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
 */
async function convertTensor(data, mapX, mapY) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map(mapX);
    const labels = data.map(mapY);

    // const inputs = data.map((d) => d.horsepower);
    // const labels = data.map((d) => d.mpg);

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
 * @param {Object} model
 * @param {Object} inputs
 * @param {Object} labels
 * @return {Object} trainedModel
 * @phreakphreak
 */
async function trainModel(model, inputs, labels, compiler, modelFitArgs) {
  model.compile(compiler);
  return await model.fit(inputs, labels, { modelFitArgs });
}

/**
 *
 * @param {Object} model
 * @param {String} path_model
 * @phreakphreak
 */
async function generateModel(model, path_model) {
  try {
    await model.save(path_model);
    return { code: 200, message: "model is generated" };
  } catch (error) {
    console.error(error);
    return { code: 500, message: "model is not generated" };
  }
}

/**
 * ? Promise
 * @param {String} dir_model
 * @phreakphreak
 */

function deleteModel(dir_model) {
  return new Promise((resolve, reject) => {
    const dir = path.join(process.cwd(), dir_model);
    fs.stat(dir, function (err) {
      if (!err) {
        console.log("file or directory exists");
        fs.rmdir(dir, { recursive: true }, (err) => {
          if (err) {
            reject({ code: 500, message: err.message });
          }
          resolve({
            code: 200,
            message: "file or directory deleted successfully",
          });
        });
      } else if (err.code === "ENOENT") {
        console.log("file or directory does not exist");
        reject({ code: 404, message: "file or directory does not exist" });
      }
    });
  });
}

/**
 *
 * @param {String} path_model
 * @phreakphreak
 */
async function loadModel(path_model) {
  //'file://path/to/my-model/model.json'
  try {
    const model = await tf.loadLayersModel(path_model);
    return {
      code: 200,
      message: "model is loaded",
      model: model,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 400,
      message: "model is not loaded",
      model: null,
    };
  }
}

async function saveModel(model) {}

async function getModel() {}

module.exports = {
  convertTensor,
  getData,
  createModel,
  trainModel,
  generateModel,
  deleteModel,
  loadModel,
};
