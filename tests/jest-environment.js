const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup()
    await this.global.page.setDefaultTimeout(30000)
  }

  async teardown() {
    await this.global.page.waitForTimeout(2000)
    await super.teardown()
  }
}

module.exports = CustomEnvironment
