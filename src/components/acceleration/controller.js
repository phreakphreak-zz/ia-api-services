const {
  convertTensor,
  getData,
  createModel,
  trainModel,
  generateModel,
  deleteModel,
  loadModel,
} = require("../../services/ia/index");
const {
  compiler,
  modelFitArgs,
  neurons,
  inputShape,
  activationInput,
  activationOutput,
  bias,
  url,
  path_model,
  dir_model,
  mapStruct,
  filterStruct,
  mapX,
  mapY,
} = require("./config");

const accelerometerController = {};

/**
 * *Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @phreakphreak
 */
accelerometerController.createModelIA = async (req, res, next) => {
  try {
    const model = await createModel(
      neurons,
      inputShape,
      activationInput,
      activationOutput,
      bias
    );
    if (!model) {
      throw new Error("model no created");
    }
    req.modelIA = model;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * *Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @phreakphreak
 */
accelerometerController.getDataIA = async (req, res, next) => {
  try {
    const data = await getData(url, mapStruct, filterStruct);
    if (!data) {
      throw new Error("data is not valid");
    }
    req.data = data;
    next();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * *Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @phreakphreak
 */
accelerometerController.convertTensorIA = async (req, res, next) => {
  try {
    const data = req.data;
    if (!data) {
      throw new Error("data is not valid");
    } else {
      const tensors = await convertTensor(data, mapX, mapY);
      if (!tensors) {
        throw new Error("tensors is not valid");
      }
      req.tensors = tensors;
      next();
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * *Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @phreakphreak
 */
accelerometerController.trainModelIA = async (req, res, next) => {
  try {
    const modelIA = req.modelIA;
    const tensors = req.tensors;
    if (!tensors && !modelIA) {
      throw new Error("data is not valid");
    }
    const { inputs, labels } = tensors;
    trainModel(modelIA, tensors, inputs, labels, compiler, modelFitArgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ? Route
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @phreakphreak
 */
accelerometerController.generateModelIA = async (req, res, next) => {
  try {
    const modelIA = req.modelIA;
    if (!modelIA) {
      throw new Error({
        code: 404,
        message: "model is not defined",
      });
    }
    const response = await generateModel(modelIA, path_model);
    res.status(response.code).json({ message: response.message });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};







accelerometerController.loadModelIA = async (req, res, next) => {
  try {
    const response = await loadModel(path_model);
  } catch (error) {}
};

accelerometerController.deleteModelIA = async (req, res, next) => {
  try {
    const response = await deleteModel(dir_model);
    res.status(response.code).json({ message: response.message });
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ message: error.message });
  }
};

accelerometerController.saveModelIA = async (req, res, next) => {};

module.exports = accelerometerController;
