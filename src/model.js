const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

async function main() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 1, inputShape: [100], activation: "sigmoid" })
  );

  const saveResult = await model.save(
    tf.io.http("http://localhost:3000/upload", {
      requestInit: { method: "POST" },
    })
  );
  console.log(saveResult);
}
main();