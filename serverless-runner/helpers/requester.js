const AWS = require("aws-sdk")

const loggers = require('./logger')
const utils = require('./utils')

const lambda = new AWS.Lambda({ region: "us-east-1" })

let numFailedTests = 0
let numPassedTests = 0
let numPendingTests = 0
let numTotalTests = 0
let numExecution = 0
let totalTimeExecution = 0

function runTest({ file, functionName, resolve, startTestTime }) {
  return lambda
  .invoke({
    FunctionName: functionName,
    Payload: JSON.stringify({
      body: {
        testMatch: file,
      }
    })
  })
  .promise()
  .then(onTestExecuted.bind(null, { file, startTestTime, resolve }))
  .catch(error => {
    if (error.message.includes('Check your AWS Secret Access Key and signing method')) {
      console.error({ error: 'Unauthenticated. Check your AWS Secret Access Key (AWS_SECRET_ACCESS_KEY) and Acess Key (AWS_ACCESS_KEY_ID).' })
    } else {
      console.error({ error: error.message, stackTrace: error.stack })
    }
    process.exit(1)
  })
}

const onTestExecuted = ({ file, startTestTime, resolve }, response) => {
  numExecution += 1
  loggers.logFileExecuted({ file, startTestTime, numExecution })
  const responseObj = utils.convertTestResponseToObject(response)
  numFailedTests += responseObj.numFailedTests
  numPassedTests += responseObj.numPassedTests
  numPendingTests += responseObj.numPendingTests
  numTotalTests += responseObj.numTotalTests
  totalTimeExecution += Date.now() - startTestTime
  resolve({
    numFailedTests,
    numPassedTests,
    numPendingTests,
    numTotalTests,
    totalTimeExecution,
  })
}

module.exports = {
  runTest,
}
