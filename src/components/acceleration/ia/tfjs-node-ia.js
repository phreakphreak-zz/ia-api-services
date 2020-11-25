const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
/**
 *
 * @returns {*} model
 */
async function createModel(NN) {
  const model = tf.sequential();

  //1st layer 6
  model.add(
    tf.layers.dense({
      units: NN[1],
      activation: "relu",
      inputShape: [NN[0]],
      useBias: true,
    })
  );

  //2nd layer 12
  model.add(
    tf.layers.dense({
      units: NN[2],
      activation: "relu",
      inputShape: [NN[1]],
      useBias: true,
    })
  );

  //3rd layer 6
  model.add(
    tf.layers.dense({
      units: NN[3],
      activation: "relu",
      inputShape: [NN[2]],
      useBias: true,
    })
  );

  //4th layer 3
  model.add(
    tf.layers.dense({
      units: NN[4],
      activation: "relu",
      inputShape: [NN[3]],
      useBias: true,
    })
  );

  //5th layer 1 OUTPUT
  model.add(
    tf.layers.dense({
      units: NN[5],
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
 * @param {*}
 * @returns {Object}
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
async function trainModel(model, inputs, labels, compiler, modelFitArgs) {
  model.compile(compiler);
  return await model.fit(inputs, labels, { modelFitArgs });
}

async function saveModel(model) {}


async function generateModel(model, path_model) {
  try {
    await model.save(path_model);
    return { code: 200, message: "model is generated" };
  } catch (error) {
    console.error(error);
    return { code: 500, message: "model is not generated" };
  }
}

//promise
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
