const glob = require("glob")

function convertTestResponseToObject(response) {
  const payload = JSON.parse(JSON.stringify(response.Payload))
  return JSON.parse(JSON.parse(payload).body)
}

function returnMax(array) {
  return {
    numFailedTests: Math.max.apply(Math, array.map((o) => o.numFailedTests)),
    numPassedTests: Math.max.apply(Math, array.map((o) => o.numPassedTests)),
    numPendingTests: Math.max.apply(Math, array.map((o) => o.numPendingTests)),
    numTotalTests: Math.max.apply(Math, array.map((o) => o.numTotalTests)),
    totalTimeExecution: Math.max.apply(Math, array.map((o) => o.totalTimeExecution)),
  }
}

function getAllTestFilesByTestPattern({ testPattern }) {
  const files = glob
    .sync(testPattern, {
      cwd: "../tests"
    })
    .map(file => `/app/${file}`)
  return {
    files,
    numTotalFiles: files.length,
  }
}

module.exports = {
  convertTestResponseToObject,
  getAllTestFilesByTestPattern,
  returnMax,
}
