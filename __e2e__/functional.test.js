/* global Feature, Scenario */
const fs = require('fs')
const path = require('path')
const jsToInject = fs.readFileSync(
  path.resolve(__dirname, '../index.user.js'),
  { encoding: 'utf8' }
)

Feature('dcard-images')

Scenario('Browse the images', I => {
  I.amOnPage('https://www.dcard.tw/f/vehicle/p/225620752')
  I.waitForElement('article h1')
  I.executeScript(js => {
    eval(js)
  }, jsToInject)
  I.wait(2)
  I.seeElement('#dcard-images-root [class^=BrowseBtn_]')
  I.saveScreenshot('BrowseBtn.png')
  I.click('#dcard-images-root [class^=BrowseBtn_]')
  I.wait(2)
  I.seeElement('[data-t=Gallery__CloseBtn]')
  I.seeElement('[data-t=Gallery__ReloadBtn]')
  I.seeElement('[data-t=Gallery__ImageGridContainer] > div')
  I.saveScreenshot('Gallery.png')
  I.click('[data-t=Gallery__ImageGridContainer] > div')
  I.seeElement('[data-t=Carousel] img')
})
