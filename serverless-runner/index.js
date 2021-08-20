const loggers = require('./helpers/logger')
const requester = require('./helpers/requester')
const utils = require('./helpers/utils')

async function runPlaywrightTestOnServerless() {
  try {
    const { files, numTotalFiles } = utils.getAllTestFilesByTestPattern({
      testPattern: 'E2E/*.test.js'
    })

    if (numTotalFiles === 0) {
      loggers.logFailedTestPattern({ testPattern })
      process.exit(1)
    }

    loggers.logStartTest({ numTotalFiles })

    const startTestTime = Date.now()
    const requestPromises = []
    files.forEach((file) => {
      requestPromises.push(
        new Promise((resolve) => {
          requester.runTest({
            file,
            functionName: 'playwright-serverless-dev-run-tests',
            startTestTime,
            resolve,
          })
        })
      )
    })

    Promise.all(requestPromises).then((allTestsResponse) => {
      const {
        numFailedTests,
        numPassedTests,
        numPendingTests,
        numTotalTests,
        totalTimeExecution,
      } = utils.returnMax(allTestsResponse)
      loggers.logResume({ numPassedTests, numFailedTests, numPendingTests })
      loggers.logComplete({
        numTotalTests,numTotalFiles, startTestTime, totalTimeExecution
      })
      process.exit(0)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

runPlaywrightTestOnServerless()
