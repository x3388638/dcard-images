const { setHeadlessWhen } = require('@codeceptjs/configure')

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS)

exports.config = {
  tests: './__e2e__/*.test.js',
  output: './__e2e__/output',
  helpers: {
    Puppeteer: {
      url: 'https://www.dcard.tw',
      show: false,
      windowSize: '1600x800'
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'dcard-images',
  plugins: {
    retryFailedStep: {
      enabled: false
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}
