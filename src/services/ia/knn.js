const KnnClassifier = require("@tensorflow-models/knn-classifier");

const { callbacks } = require("@tensorflow/tfjs");
/**
 *
 * @param {Object} classifier
 * @param {Tensor} tensor
 * @param {Number} label
 * @return {Object} classifierWithExample
 */
async function setExampleClassifier(classifier, tensor, label) {
  classifier.addExample(tensor, label);
  return classifier;
}

/**
 * @return {Object} classifier model
 */
async function createClassifier() {
  const classifier = KnnClassifier.create();
  return classifier;
}

/**
 *
 * @param {Object} classifier
 * @param {Tensor} tensor
 * @return {Object} result
 */
async function predictClassifier(classifier, tensor) {
  try {
    const result = await classifier.predictClass(tensor);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
