const { Signale } = require('signale');

const signale = new Signale({
  types: {
    star: {
			badge: '/',
      label: 'executed'
    },
		success: {
			label: 'tests passed'
		},
		pending: {
			label: 'tests pending'
		},
		error: {
			label: 'tests failed'
		},
		start: {
			label: 'starting test'
		}
  }
})

signale.config({
  displayTimestamp: true,
	underlineLabel: false
})

const durationInSeconds = startTime => {
	const durationInMilliseconds = Date.now() - startTime
	const durationInSeconds = ((durationInMilliseconds % 60000) / 1000).toFixed(2)
	return `${durationInSeconds} seconds`
}

const millisToMinutesAndSeconds = millis => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function logStartTest({ numTotalFiles }) {
	signale.start(`Test will run on ${numTotalFiles} files\n`)
}

function logFileExecuted({ file, startTestTime, numExecution }) {
	numExecution = ('00' + numExecution).slice(-3)
	signale.star({ prefix: `[${numExecution}]`, message: `File "${file}" executed, took ${durationInSeconds(startTestTime)}` });
}

function logResume({ numPassedTests, numPendingTests, numFailedTests }) {
	console.log();
	signale.success(numPassedTests)
	signale.pending(numPendingTests)
	signale.error(numFailedTests)
}

function logComplete({ numTotalTests, numTotalFiles, startTestTime, totalTimeExecution }) {
	console.log();
	signale.complete(`${numTotalTests} tests on ${numTotalFiles} files executed in ${durationInSeconds(startTestTime)}\n`)
	signale.info(`Duration without serverless (mm:ss): ${millisToMinutesAndSeconds(totalTimeExecution)}`)
	const timeSavedInMillis = totalTimeExecution - (Date.now() - startTestTime)
	signale.info(`Time saved (mm:ss): ${millisToMinutesAndSeconds(timeSavedInMillis)}`)
}

function logFailedTestPattern({ testPattern }) {
	signale.fatal(`'${testPattern}' pattern entered matches no test file`)
}

module.exports = {
	logStartTest,
	logFileExecuted,
	logResume,
	logComplete,
	logFailedTestPattern,
}
