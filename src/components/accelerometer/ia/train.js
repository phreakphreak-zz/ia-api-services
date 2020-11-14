const { convertTensor, getData, createModel, trainModel } = require("./main");
const { compiler, modelFitArgs, URI,nn } = require("./config");

// Convert the data to a form we can use for training.
const model = createModel(nn);
const data = getData(URI);
const tensorData = convertTensor(data);
const { inputs, labels } = tensorData;
// Train the model
await trainModel(model, inputs, labels, compiler, modelFitArgs);

console.log("Done Training");
