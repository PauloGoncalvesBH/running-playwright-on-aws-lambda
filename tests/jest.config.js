module.exports = {
  name: 'play-e2e',
  displayName: 'e2e-play',
  globals: {
    BASE_URL: 'https://front.serverest.dev'
  },
  preset: "jest-playwright-preset",
  globalSetup: 'jest-playwright-preset/setup',
  globalTeardown: 'jest-playwright-preset/teardown',
  setupFilesAfterEnv: [
    './jest.setup.js',
    'jest-playwright-preset/lib/extends.js',
  ],
  testEnvironment: './jest-environment.js',
  runner: 'jest-playwright-preset/runner',
  verbose: true,
}
