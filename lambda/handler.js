const { runCLI } = require('jest')

const jestConfig = require('./jest.config')

module.exports.runTest = async event => {
  try {
    const { testMatch } = event.body
    if (typeof testMatch === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify('Não foi encontrada a propriedade \'testMatch\'.')
      }
    }

    const { results } = await runCLI({
      ...jestConfig,
      testMatch: [testMatch]
    }, [''])

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  } catch (error) {
    console.error({ error });
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
