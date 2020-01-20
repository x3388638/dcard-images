// in this file you can append custom step methods to 'I' object
const fs = require('fs')
const path = require('path')
const jsToInject = fs.readFileSync(path.resolve(__dirname, './index.user.js'), {
  encoding: 'utf8'
})

module.exports = function() {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    amOnSamplePageAndInjectJS() {
      this.amOnPage('/f/vehicle/p/225620752')
      this.waitForElement('article h1')
      this.executeScript(js => {
        eval(js)
      }, jsToInject)
      this.wait(2)
    }
  })
}
